import React, { useState } from 'react'
import { ScrollView, View, Text } from '@tarojs/components'
import { Button, Grid, TextArea } from "@nutui/nutui-react-taro"
import Taro, { useLoad } from '@tarojs/taro'
import clsx from 'clsx'
import './index.scss'
import request from '../../utils/request'

function Index() {

  // state prompt and negative_prompt
  const [prompt, setPrompt] = useState('');
  const [negative_prompt, setNegativePrompt] = useState('');

  const [typeIdx, setTypeIdx] = useState(0);
  const [types, setTypes] = useState<any[]>([]);

  // style and styleIdx
  const [styleIdx, setStyleIdx] = useState(0);
  const [styles, setStyles] = useState<any[]>([]);

  // attrs and attrIdx
  const [attrIdx, setAttrIdx] = useState<Map<string, number[]>>(new Map());
  const [attrs, setAttrs] = useState<any[]>([]);

  const [huamianIdx, setHuamianIdx] = useState(-1);

  const huamian = [{
    value: 0,
    name: "1:1"
  }, {
    value: 1,
    name: "6:9"
  }, {
    value: 2,
    name: "9:6"
  }];

  const handleChangeTypeIdx = (idx) => {
    setTypeIdx(idx);
    getAllStyles(types[idx].id);
    setAttrIdx(new Map());
  }

  const handleStylesIdx = (idx) => {
    setStyleIdx(idx);
    getAllAttrs(styles[idx].id);
    setAttrIdx(new Map())
  }

  // changeAttrs
  const handleChangeAttrIdx = (name: string, idx: number) => {
    const attrsSet = attrIdx.get(name) || [];
    // if idx in set add esle del
    if (attrsSet.includes(idx)) {
      attrsSet.splice(attrsSet.indexOf(idx), 1);
    }
    else {
      attrsSet.push(idx);
    }
    attrIdx.set(name, attrsSet);
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

  const getCurType = () => {
    return types[typeIdx];
  }

  const getCurStyle = () => {
    return styles[styleIdx];
  }

  const getCurAttr = (name) => {
    return attrs.find(v => v.name === name);
  }

  const handleRenderImage = async () => {

    let promptBody = "";
    promptBody += `${getCurType().en_name}`;
    promptBody += ` ,${getCurStyle().en_name}`;
    // foreach the attrs
    for (const key of attrIdx.keys()) {
      const cur = getCurAttr(key);
      promptBody += `,(${cur.en_name} `;
      const attrSet = attrIdx.get(key) || [];
      const attrLen = attrIdx.get(key)?.length || 0;
      attrSet?.forEach((aIdx, forIdx) => {
        const value = cur.values[aIdx];
        if (forIdx === attrLen - 1) {
          promptBody += `${value.en_name}`
        } else {
          promptBody += `${value.en_name} and `
        }
      })
      promptBody += ")";
    }

    const resp = await request(`sd/text2img?cid=${getCurStyle().id}`, {
      method: "POST", data: {
        prompt: promptBody,
        negative_prompt
      }
    });
    const { error } = resp;

    if (error) {
      Taro.showToast({
        title: "生成失败",
        icon: "error",
        duration: 2000
      })
    } else {
      Taro.showToast({
        title: '创建任务成功，请到任务列表查询进度',
        icon: "success",
        duration: 2000
      })
    }

  }

  useLoad(async () => {
    const resp = await request("category");
    setTypes(resp.data);
    getAllStyles(resp.data[0].id);

    const { code } = await Taro.login();
    const { data } = await request(`miniapp/open_id?code=${code}`);

    Taro.setStorageSync("token", data);
  })

  return (
    <View className="nutui-react-demo container page">
      <View className="lable">
        说出你想绘画的内容
      </View>
      <TextArea rows={2} className='textarea' value={prompt} onChange={e => setPrompt(e)} />

      <View className="lable">
        画面中不想出现的内容
      </View>
      <TextArea rows={2} className='textarea' value={negative_prompt} onChange={e => setNegativePrompt(e)} />

      <View className="lable">
        设计行业
      </View>
      <ScrollView className='scroll-x' scrollX={true} enableFlex={true}>
        {
          types.map((t, idx) => (
            <Button className='btn' key={t.id} size='small' shape="square" type='primary' fill={idx === typeIdx ? 'solid' : 'outline'} onClick={() => handleChangeTypeIdx(idx)}>
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
            <Button className='btn' key={t.id} size='small' shape="square" type='primary' fill={idx === styleIdx ? 'solid' : 'outline'} onClick={() => handleStylesIdx(idx)}>
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
                    <Button
                      className='btn'
                      key={t.id}
                      size='small'
                      shape="square"
                      type='primary'
                      fill={attrIdx.get(a.name)?.includes(idx) ? 'solid' : 'outline'}
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
      <View className="lable">
        画面尺寸
      </View>

      <Grid className='grid' columns={3} gap={5}>
        {huamian.map((v, idx) => (
          <Grid.Item className={clsx('grid-item', {
            'hm-last-child': idx === huamian.length - 1,
          })} onClick={() => { setHuamianIdx(idx) }}>
            <View className={clsx('hm', {
              'hm-select': idx === huamianIdx,
            })}>
              <Text>{v.name}</Text>
            </View>
          </Grid.Item>
        ))}
      </Grid>

      <View className='mt'>
        <Button size="normal" shape="square" type='primary' block onClick={handleRenderImage}>
          立即渲染(消耗-1积分)
        </Button>
      </View>

    </View>
  )
}

export default Index
