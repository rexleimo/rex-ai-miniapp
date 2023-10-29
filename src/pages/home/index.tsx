import React from "react";
import { Row, Col } from '@nutui/nutui-react-taro'
import Taro, { useLoad } from "@tarojs/taro";
import request from "../../utils/request";

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
                    艺术二维码
                </Col>

                <Col span="12" onClick={() => onNavigateToQrcode('/pages/avatar/index')}>
                    个性头像
                </Col>

                <Col span="12">
                    隐藏文字
                </Col>
            </Row>
        </>
    )
}

export default Index