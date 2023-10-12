import React, { useState } from 'react'
import { ScrollView, View } from '@tarojs/components'
import { Button, TextArea } from "@nutui/nutui-react-taro"
import { useLoad } from '@tarojs/taro'
import './index.scss'
import request from '../../utils/request'

function Index() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [types, setTypes] = useState<any[]>([]);

  // style and styleIdx
  const [styleIdx, setStyleIdx] = useState(0);
  const [styles, setStyles] = useState<any[]>([]);

  // attrs and attrIdx
  const [attrIdx, setAttrIdx] = useState(new Map());
  const [attrs, setAttrs] = useState<any[]>([]);


  const handleChangeTypeIdx = (idx) => {
    setTypeIdx(idx);
  }

  const handleStylesIdx = (idx) => {
    setStyleIdx(idx);
  }

  // changeAttrs
  const handleChangeAttrIdx = (name: string, idx: number) => {
    attrIdx.set(name, idx);
    setAttrIdx(new Map(attrIdx));

  }

  const getAllStyles = async (cid: string) => {

    const resp = await request(`category?pid=${cid}`);
    const {
      data: list
    } = resp;

    setStyles(list);
    const shift = list[0];
    getAllAttrs(shift.id);
  }

  const getAllAttrs = async (cid: string) => {
    const resp = await request(`category/attr/${cid}`)
    const {
      data: list
    } = resp;
    setAttrs(list)
  }

  useLoad(async () => {
    const resp = await request("category");
    setTypes(resp.data);
    getAllStyles(resp.data[0].id);
  })

  return (
    <View className="nutui-react-demo container page">
      <View className="lable">
        说出你想绘画的内容
      </View>
      <TextArea rows={2} className='textarea' />

      <View className="lable">
        画面中不想出现的内容
      </View>
      <TextArea rows={2} className='textarea' />

      <View className="lable">
        设计行业
      </View>
      <ScrollView className='scroll-x' scrollX={true} enableFlex={true}>
        {
          types.map((t, idx) => (
            <Button key={t.id} size='small' shape="square" type='primary' fill={idx === typeIdx ? 'solid' : 'outline'} onClick={() => handleChangeTypeIdx(idx)}>
              {t.name}
            </Button>
          ))
        }
      </ScrollView>

      <View className="lable">
        设计类型
      </View>
      <ScrollView className='scroll-x' scrollX={true} enableFlex={true}>
        {
          styles.map((t, idx) => (
            <Button key={t.id} size='small' shape="square" type='primary' fill={idx === styleIdx ? 'solid' : 'outline'} onClick={() => handleStylesIdx(idx)}>
              {t.name}
            </Button>
          ))
        }
      </ScrollView>

      {
        attrs.map(a => (
          <>
            <View className="lable">
              {a.name}
            </View>
            <View>
              {
                a.values.map((t, idx) => {
                  return (
                    <Button key={t.id}
                      size='small'
                      shape="square"
                      type='primary'
                      fill={idx === attrIdx.get(a.name) ? 'solid' : 'outline'}
                      onClick={() => handleChangeAttrIdx(a.name, idx)}>
                      {t.name}
                    </Button>
                  )
                })
              }
            </View>
          </>
        ))
      }

      <Button size="normal" shape="square" type='primary' block>立即渲染</Button>

    </View>
  )
}

export default Index
