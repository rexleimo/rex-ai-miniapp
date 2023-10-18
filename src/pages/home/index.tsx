import React from "react";
import { Row, Col } from '@nutui/nutui-react-taro'
import Taro, { useLoad } from "@tarojs/taro";
import request from "../../utils/request";

function Index() {

    const onNavigateToQrcode = () => {
        Taro.navigateTo({
            url: '/pages/qrcode/index',
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

                <Col span="12" onClick={onNavigateToQrcode}>
                    艺术二维码
                </Col>

                <Col span="12">
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