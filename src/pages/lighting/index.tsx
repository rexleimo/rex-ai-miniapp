import { Button, Overlay, Picker } from "@nutui/nutui-react-taro";
import { Image, View } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import React, { useState } from "react";
import request from "../../utils/request";
import './index.scss'
import { Ask2 } from '@nutui/icons-react-taro'
import QrcodeHelpImage from '../../assets/qrcode_help.png';
import { TaroUtilsChooseImage } from "../../utils/taro/chooseImage";

function QrcodePage() {
    const [qrcode, setQrcode] = useState('');
    const [preview, setPreview] = useState('');
    const [openHelp, setOpenHelp] = useState(false);

    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState([]);

    const handleChooseQrcode = async () => {
        const [qrcodeBase64, tempFilePaths] = await TaroUtilsChooseImage();
        setPreview(tempFilePaths);
        setQrcode(qrcodeBase64 as string)
    }

    const showVisible = () => {
        setVisible(true);
    }

    const handleSwitchToTask = () => {
        Taro.switchTab({
            url: '/pages/task/index'
        })
    }

    const handleOpenHelp = () => {
        setOpenHelp(true)
    }

    useLoad(async () => {
        const resp = await request('styles/list');
        if (resp.styles) {
            setOptions(resp.styles.map((item) => ({ value: item.id, text: item.name })));
        }
    })

    const handleConfirmPicker = (list, values) => {
        // console.log(list, values)
        const value = (values as Array<any>).shift();
        request('sd/lighting', {
            method: "POST",
            data: {
                qrcode: qrcode,
                style_id: value
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


    return (
        <>
            <View className="page container">
                <Image className="mb max-image" mode="aspectFit" src={preview} />
                <Button className="mb" type="info" shape="square" block onClick={handleChooseQrcode}>选择图片</Button>
                <Button className="mb" type="success" shape="square" block onClick={showVisible}>渲染(积分-1)</Button>
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
            <Picker
                visible={visible}
                options={options}
                onConfirm={handleConfirmPicker}
                onClose={() => setVisible(false)}
            // onChange={changePicker}
            />
        </>
    )
}

export default QrcodePage;