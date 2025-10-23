import { _decorator, Component, Node, WebView } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoiNgayContentScene')
export class BoiNgayContentScene extends Component {

    @property(WebView)
    webView: WebView = null;

    protected onLoad(): void {
        this.webView.url = "https://www.google.com";
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

