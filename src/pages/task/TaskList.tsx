import { View, Image } from '@tarojs/components'
import NoData from '../../assets/no_data.png'
import { Button } from '@nutui/nutui-react-taro'
import React from 'react'
import Taro from '@tarojs/taro'
import './index.scss';

type TaskListProps = {
    tasks: any[];
    handleToggleShow: Function;
}

function TaskList(props: TaskListProps) {
    console.log('xx')
    const { tasks, handleToggleShow } = props;

    const handleShowImage = (id: string) => {
        // find task 
        const task = tasks.find(item => item.id === id)
        // if task set CurUri
        if (task) {
            handleToggleShow(task.images[0]);
        }
    }

    const handleSaveImage = (id: string) => {
        const saveFileToPhotosAlbum = () => {
            const info = tasks.find(v => v.id === id);
            if (info) {
                Taro.downloadFile({
                    url: info.images[0],
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

    return (
        <View className='card-container'>
            {
                tasks.map(v => (
                    <View className='card'>
                        {
                            v.images && (
                                <Image onClick={() => handleShowImage(v.id)} className='img' src={v.images[0]} mode='aspectFit' />
                            )
                        }
                        {
                            !v.images && (
                                <Image className='img' src={NoData} mode='aspectFit' />
                            )
                        }
                        <View className='card-body'>
                            <Button shape='square' size='small' className='btn' fill='outline' type='primary' onClick={() => handleSaveImage(v.id)}>下载图片</Button>
                        </View>
                    </View>
                ))
            }
        </View>
    );
}

export default React.memo(TaskList)