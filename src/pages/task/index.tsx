import { Image, Button, Overlay, Pagination } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { useDidHide, useDidShow } from '@tarojs/taro';

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { API_URL } from '../../utils/config';
import request from '../../utils/request';

import './index.scss';
import TaskList from './TaskList';
import Taro from '@tarojs/taro';

function Index() {

  const [tasks, setTasks] = useState<any[]>([]);
  const [pageSize] = useState(12);
  const [pageNum, setPageNum] = useState(-1);
  const [total, setTotal] = useState(0);

  const [visible, setVisible] = useState(false);
  const [curUri, setCurUri] = useState('');
  const [curId, setCurId] = useState('');

  const handleToggleShow = useCallback((uri: string, id: string) => {
    setCurUri(uri)
    setVisible(true);
    setCurId(id)
  }, []);

  const onClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (pageNum === -1) {
      setTasks([]);
      return
    }
    getFetchList();
  }, [pageSize, pageNum])

  useDidShow(async () => {
    setPageNum(1);
  })

  useDidHide(() => {
    setPageNum(-1);
    setTasks([]);
  })

  const getFetchList = async () => {
    const resp = await request(`task?pageSize=${pageSize}&page=${pageNum}`);
    const { data: tasks, count } = resp;
    if (!tasks) return
    tasks.forEach((v: any) => {
      if (v.images) {
        v.images = v.images?.map((img) => `${API_URL}${img}`)
      }
    })
    setTotal(count);
    setTasks(tasks);
  }


  const handleMoreFetch = (v: number) => {
    setPageNum(v);
  }

  const handleSaveImage = () => {
    const saveFileToPhotosAlbum = () => {
      if (curUri) {
        Taro.downloadFile({
          url: curUri,
          success: (res) => {
            Taro.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                Taro.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          }
        })
      }
    }

    Taro.getSetting({
      success(setting) {
        if (!setting.authSetting['scope.writePhotosAlbum']) {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              saveFileToPhotosAlbum()
            }
          })
        } else {
          saveFileToPhotosAlbum()
        }
      },
    })

  }

  const handleDelete = () => {
    request(`task/${curId}`, { method: 'DELETE' })
      .then(() => {
        const newTasks = tasks.filter(task => task.id !== curId);
        setTasks(newTasks);
        setCurUri('')
        setCurId('')
        setVisible(false)
      })
      .catch(() => {
        Taro.showToast({
          title: '删除失败',
          icon: 'none',
          duration: 2000
        })
      })
  }


  return (
    <>
      <View className='nutui-react-demo container page'>
        {
          tasks.length > 0 && (
            <>
              <TaskList tasks={tasks} handleToggleShow={handleToggleShow} />
              <Pagination
                value={pageNum}
                total={total}
                pageSize={10}
                mode="simple"
                onChange={handleMoreFetch}
              />
            </>
          )
        }
      </View>
      <Overlay
        visible={visible}
        style={{ '--nutui-overlay-zIndex': 2020, } as any}
        lockScroll
        onClick={onClose}
      >
        <View className="flex-center flex-column">
          <View className='overlay-img'>
            <Image mode="aspectFit" src={curUri} />
          </View>
          <View className='card-body'>
            <Button
              shape='round'
              size='small'
              className='btn'
              fill='solid'
              type='primary'
              onClick={handleSaveImage}>
              下载图片
            </Button>
            <Button
              shape='round'
              size='small'
              className='btn ml'
              type="warning"
              onClick={handleDelete}>
              删除
            </Button>
          </View>
        </View>
      </Overlay>

    </>
  )
}


export default Index
