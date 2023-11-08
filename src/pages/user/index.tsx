import { Button, View } from "@tarojs/components";
import React, { useState } from "react";
import './index.scss'
import { Avatar, Cell } from '@nutui/nutui-react-taro'
import NoData from '../../assets/no_data.png'
import request from "../../utils/request";
import Taro, { useDidShow } from "@tarojs/taro";

function Index() {

    const [user, setUser] = useState<any>({})

    useDidShow(async () => {
        const resp = await request('user/info')
        const { data } = resp
        setUser(data);
    })

    const handleCheckInClick = async () => {
        try {
            await request('user/check_in')
            setUser((pre) => ({
                ...pre,
                bonus: pre.bonus + 50
            }))
        } catch (e) {
            Taro.showToast({
                title: '今天已认领',
                icon: 'error',
                duration: 2000
            })
        }
    }

    const handleUserInfo = () => {
        Taro.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {

                request('user/replenish', {
                    method: "POST", data: {
                        name: res.userInfo.nickName,
                        avatar: res.userInfo.avatarUrl
                    }
                }).then(() => {
                    setUser({
                        ...user,
                        name: res.userInfo.nickName,
                        avatar: res.userInfo.avatarUrl,
                        bonus: user.bonus + 100
                    })
                }).catch((err) => {
                    const { error_code } = err;
                    let errmsg = '';
                    if (error_code === 40203) {
                        errmsg = '已经领取了';
                    } else {
                        errmsg = '网络错误';
                    }
                    Taro.showToast({
                        title: errmsg,
                        icon: 'error',
                        duration: 2000
                    })
                })
            },
            fail: (err) => {
                console.log(err)
            }
        })
    }

    return (
        <>
            <View className="container page page-hd">
                <Avatar
                    className="max-image"
                    size="large"
                    src={user?.avatar || NoData}
                />
                <View className="ml">
                    <View>{user?.name}</View>
                    {
                        !user?.is_replenish && (
                            <View className="text">
                                <Button className="user-btn" onTap={handleUserInfo}>
                                    完善信息(+100)积分(点击)
                                </Button>
                            </View>
                        )
                    }
                </View>
            </View>

            <View className="container page">
                <Cell.Group
                    divider={true}
                >
                    <Cell title="我的积分" extra={user?.bonus} />
                    <Cell align="center" className="nutui-cell--clickable"
                        title="每日签到"
                        extra="+50"
                        onClick={handleCheckInClick} />
                    {/* <Cell className="nutui-cell--clickable" title="观看广告" extra="+10" /> */}
                </Cell.Group>
            </View>
        </>
    );
}

export default Index;