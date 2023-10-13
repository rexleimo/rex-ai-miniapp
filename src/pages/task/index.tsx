import { Image, Button } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro';

import React, { useEffect, useState } from 'react'
import { API_URL } from '../../utils/config';
import request from '../../utils/request';

import './index.scss';

function Index() {

  const [tasks, setTasks] = useState<any[]>([]);
  const [pageSize] = useState(10);
  const [pageNum, setPageNum] = useState(-1);
  const [noMor, setNoMor] = useState(false);

  useEffect(() => {
    if (pageNum === -1) {
      return
    }
    getFetchList();
  }, [pageSize, pageNum])

  useDidShow(async () => {
    setPageNum(1);
    setTimeout(() => {
      getUpdateTaskInfo();
    }, 5000);
  })

  useDidHide(() => {
    setPageNum(-1);
    setTasks([]);
  })

  const getFetchList = async () => {
    const resp = await request(`task?pageSize=${pageSize}&page=${pageNum}`);
    const { data: tasks } = resp;
    if (!tasks) return
    tasks.forEach((v: any) => {
      if (v.images) {
        v.images = v.images?.map((img) => `${API_URL}${img}`)
      }
    })
    setTasks((pre) => pre.concat(tasks));
    setNoMor(!(pageSize === tasks.length))
  }

  const getUpdateTaskInfo = async () => {
    const shouldIds = tasks.filter(v => v.status === 0).map(v => v.id);
    const resp = await request('task/ids', { method: 'POST', data: { task_id: shouldIds } });
    const { data } = resp;
    if (data) {
      for (const v in data) {
        const cur = v as any
        const idx = tasks.findIndex(t => t.id === cur.id);
        if (idx > -1) {
          if (cur.status === 200) {
            cur.images = cur.images?.map((img) => `${API_URL}${img}`)
          }
          tasks[idx] = cur;
        }
      }
      setTasks([...tasks]);
      const statusIsNormol = data.filter(v => v.status === 0);
      if (statusIsNormol.length > 0) {
        setTimeout(() => {
          getUpdateTaskInfo();
        }, 10000);
      }
    }
  }

  const handleMoreFetch = () => {
    if (pageNum * pageSize === tasks.length) {
      setPageNum(pageNum + 1);
    }
  }


  return (
    <View className='nutui-react-demo container page'>
      <View className='waterfall'>
        {
          tasks.map(v => (
            <View className='card'>
              {
                v.images && (
                  <Image src={v.images[0]} mode='widthFix' />
                )
              }
            </View>
          ))
        }
      </View>

      <View className='more-container'>
        {
          !noMor && (
            <Button
              size='small'
              shape='square'
              fill='outline'
              className='btn'
              onClick={handleMoreFetch}>
              加载更多
            </Button>
          )
        }
      </View>

    </View>
  )
}


export default Index
