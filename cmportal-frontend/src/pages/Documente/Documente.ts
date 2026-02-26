import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TDocument} from "@/types/TDocument";

@Options({
    name: "Documente",
    components: {}
})
export default class Documente extends Vue {
    public inputSearchArticle='';
    declare public $refs: any;
    public userStore = getModule(user);
    public arrDocuments:TDocument[]=[{appid: '123', dataDocument: '12 Jan 2021', idDocument: 'ABC12345', tipDocument: 'contract'}
    ,{appid: '456', dataDocument: '12 Jan 2021', idDocument: 'ABC12346', tipDocument: 'contract'}
    ,{appid: '789', dataDocument: '14 Jan 2021', idDocument: 'ABC12347', tipDocument: 'gdpr'}
    ,{appid: '1', dataDocument: '21 Jan 2021', idDocument: 'ABC187872', tipDocument: 'act aditional'}
    ,{appid: '2', dataDocument: '22 Jan 2021', idDocument: 'XY6215S', tipDocument: 'anexa 2 contract'}
    ,{appid: '3', dataDocument: '23 Jan 2021', idDocument: '92829JAH', tipDocument: 'act aditional'}];

    get user(): TUser {
        return this.userStore.user;
    }

    public activated(): void {
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar('DOCUMENTE');
        }
    }
}
