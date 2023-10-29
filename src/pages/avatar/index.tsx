import { Button, Picker } from "@nutui/nutui-react-taro";
import { Image, View } from "@tarojs/components";
import { useState } from "react";
import request from "../../utils/request";
import { TaroUtilsChooseImage } from "../../utils/taro/chooseImage";
import Taro, { useLoad } from "@tarojs/taro";

function AvataerPage() {
    const [preview, setPreview] = useState('');
    const [qrcode, setQrcode] = useState<string | ArrayBuffer>('');


    const [visible, setVisible] = useState<boolean>(false);
    const [options, setOptions] = useState([]);

    const handleChooseQrcode = async () => {
        const [qrcodeBase64, tempFilePaths] = await TaroUtilsChooseImage();
        setPreview(tempFilePaths);
        setQrcode(qrcodeBase64);
        setVisible(true);
    }

    const handleConfirmPicker = (list, values) => {
        // console.log(list, values)
        const value = (values as Array<any>).shift();
        request('sd/avatar', {
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

    useLoad(async () => {
        const resp = await request('styles/list');
        if (resp.styles) {
            setOptions(resp.styles.map((item) => ({ value: item.id, text: item.name })));
        }
    })


    return (
        <>
            <View className="page container">
                <Image className="mb max-image" mode="aspectFit" src={preview} />
                <Button className="mb" type="info" shape="square" block onClick={handleChooseQrcode}>选择图片</Button>
            </View>
            <Picker
                visible={visible}
                options={options}
                onConfirm={handleConfirmPicker}
                onClose={() => setVisible(false)}
            />
        </>
    )
}

export default AvataerPage;