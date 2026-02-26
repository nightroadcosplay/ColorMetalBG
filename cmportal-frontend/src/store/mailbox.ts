import store from './index';
import {Module, VuexModule, Mutation, Action, getModule} from 'vuex-module-decorators';
import {TMail} from '@/types/TMail';
import { Notify } from 'quasar';
import { ServiceAlerts } from '@/services/ServiceAlerts';
import user from './user';
import { ServiceUser } from '@/services/ServiceUser';
@Module({ namespaced: true, dynamic: true, store, name: 'storeMailbox'})
export default class Mailbox extends VuexModule {
    public emails: TMail[]=[];
    public userStore = getModule(user);

    @Mutation
    public PUSH_EMAIL(email: TMail) {
        const vueInst=this;
        Notify.create({
            type: 'warning',
            caption: `<div style="max-width: 200px;">${email.messageBody}</div>`,
            message: email.messageTitle,
            position: 'top-right',
            multiLine: true,
            timeout: 3500,
            html: true,
            icon: 'announcement'
        })

        ServiceAlerts.getCounters().then( responce => {
            if(responce.status == 'success'){
                this.userStore.set_screencountadrese(responce.countAdrese);
                this.userStore.set_screencountoferte(responce.countOferte);
            }
        });

        ServiceUser.checkSession().then(responce => {
            console.log(responce);
        });
    }
    @Action
    public push_email(email: TMail) {
        this.context.commit('PUSH_EMAIL', email);
    }


}
