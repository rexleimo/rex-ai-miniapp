import { Button, Overlay } from "@nutui/nutui-react-taro";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";
import { ReadFile } from "../../utils/taro/read-file";
import request from "../../utils/request";
import './index.scss'
import { Ask2 } from '@nutui/icons-react-taro'
import QrcodeHelpImage from '../../assets/qrcode_help.png'

function QrcodePage() {
    const [qrcode, setQrcode] = useState('');
    const [preview, setPreview] = useState('');
    const [openHelp, setOpenHelp] = useState(false)

    const handleChooseQrcode = async () => {
        const resp = await Taro.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],   //所选的图片的尺寸
            sourceType: ['album', 'camera'],        //选择图片的来源
        })

        const qrcodeBase64 = await ReadFile(resp.tempFilePaths[0])
        setPreview(resp.tempFilePaths[0]);
        setQrcode(qrcodeBase64 as string)
    }

    const handleRender = async () => {
        request('sd/qrcode', {
            method: "POST",
            data: {
                qrcode: qrcode
            }
        }).then(() => {
            Taro.showToast({
                title: "二维码人任务创建成功"
            })
        }).catch(() => {
            Taro.showToast({
                title: "二维码人任务创建失败",
                icon: 'error',
                duration: 2000
            })
        })
    }

    const handleSwitchToTask = () => {
        Taro.switchTab({
            url: '/pages/task/index'
        })
    }

    const handleOpenHelp = () => {
        setOpenHelp(true)
    }

    return (
        <>
            <View className="page container">
                <Image className="mb max-image" mode="aspectFit" src={preview} />
                <Button className="mb" type="info" shape="square" block onClick={handleChooseQrcode}>选择图片</Button>
                <Button className="mb" type="success" shape="square" block onClick={handleRender}>渲染(积分-1)</Button>
                <Button type="primary" shape="square" block onClick={handleSwitchToTask}>去任务中心</Button>
                <View className="help-btn" onClick={handleOpenHelp}>
                    <Ask2 />
                </View>
            </View>
            <Overlay
                visible={openHelp}
                onClick={() => setOpenHelp(false)}
                lockScroll
            >
                <View className="help-container">
                    <Image mode="aspectFill" src={QrcodeHelpImage} />
                </View>
            </Overlay>
        </>
    )
}

export default QrcodePage;