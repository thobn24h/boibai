import { _decorator, Component, Label, Node } from 'cc';
import dayjs from 'dayjs';

const { ccclass, property } = _decorator;

@ccclass('BoiNgayScene')
export class BoiNgayScene extends Component {

    @property(Label)
    labelBoiNgay: Label = null;

    protected onLoad(): void {
        const now = dayjs();

        // Mảng tên thứ tiếng Việt
        const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
        const dayOfWeek = daysOfWeek[now.day()];

        // Định dạng: Thứ, ngày, tháng, năm
        const formattedDate = `${dayOfWeek}, ngày ${now.format('DD')} tháng ${now.format('MM')} năm ${now.format('YYYY')}`;
        this.labelBoiNgay.string = formattedDate;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

