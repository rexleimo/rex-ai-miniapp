import { View, Image } from '@tarojs/components'
import NoData from '../../assets/no_data.png'
import { Col, Row } from '@nutui/nutui-react-taro'
import React from 'react'
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
            handleToggleShow(task.images[0], id);
        }
    }



    return (
        <Row gutter="5">
            {
                tasks.map(v => (
                    <Col span="8" style={{ marginBottom: '2px' }}>
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
                        </View>
                    </Col>
                ))
            }
        </Row>
    );
}

export default React.memo(TaskList)