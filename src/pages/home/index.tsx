import React from "react";
import { Row, Col } from '@nutui/nutui-react-taro'
import Taro, { useLoad } from "@tarojs/taro";
import request from "../../utils/request";
import { Image, View } from '@tarojs/components'

import OnePng from '../../assets/1.png'
import TwoPng from '../../assets/2.png'
import ThreePng from '../../assets/3.png'

function Index() {

    const onNavigateToQrcode = (url) => {
        console.log(url)
        Taro.navigateTo({
            url,
        })
    }



    useLoad(async () => {
        const { code } = await Taro.login();
        const { data } = await request(`miniapp/open_id?code=${code}`);

        Taro.setStorageSync("token", data);
    })

    return (
        <>
            <Row gutter="10">

                <Col span="12" onClick={() => onNavigateToQrcode('/pages/qrcode/index')}>
                    <View style={{ width: '100%', height: '140px' }} className="max-image">
                        <Image src={OnePng} />
                    </View>
                    <View style={{ textAlign: 'center' }}>
                        艺术二维码
                    </View>
                </Col>

                <Col span="12" onClick={() => onNavigateToQrcode('/pages/avatar/index')}>
                    <View style={{ width: '100%', height: '140px' }} className="max-image">
                        <Image src={TwoPng} />
                    </View>
                    <View style={{ textAlign: 'center' }}>
                        个性头像
                    </View>
                </Col>

                <Col span="12" onClick={() => onNavigateToQrcode('/pages/lighting/index')}>
                    <View style={{ width: '100%', height: '140px' }} className="max-image">
                        <Image src={ThreePng} />
                    </View>
                    <View style={{ textAlign: 'center' }}>
                        隐藏文字
                    </View>
                </Col>
            </Row>
        </>
    )
}

export default Index