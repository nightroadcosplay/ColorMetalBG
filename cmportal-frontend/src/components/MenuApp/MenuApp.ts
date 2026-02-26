import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import user from '@/store/user';
import {getModule} from 'vuex-module-decorators';
import {TUser} from '@/types/TUser';

@Options({
    name: "MenuApp",
    components: {}
})
export default class MenuApp extends Vue {
    @Prop({ default: '0' }) public readonly userid!: string;
    @Prop() public onCloseMenu!: ()=>void;
    public nrOfMyDocuments = 0;
    public nrOfPendingToRegister = 0;
    public nrDocumenteDeRepartizate = 0;
    declare public $refs: any;
    public userStore = getModule(user);
    public goToView(pRouteViewName: string ): void {
        const vueInst=this;
        if(pRouteViewName=='AdminUsers'){
            this.$router.push({ name: pRouteViewName, params: { companyAppid:0 } }).catch(()=>{vueInst.onCloseMenu();});
        }else{
            this.$router.push({ name: pRouteViewName }).catch(()=>{vueInst.onCloseMenu();});
        }

    }

    public getNrOfDocumentsForMe():void{
        this.nrDocumenteDeRepartizate = 3;
    }


    public get user(): TUser {
        return this.userStore.user;
    }

    public onGoToBrowseCategories(): void {
        this.$router.push({name: 'BrowseCategories',  params: { pid: '0', typeOfAccess: 'fromDashboard' }});
        //this.$router.push({name: 'BrowseCategories' });
    }

    public openTehnipedia(): void {
        window.open("https://color-metal.ro/ro/tehnipedia");
    }

    public goToMyProfile(): void {
        this.$router.push({ name: 'MyProfile' });
    }

    public logout(): void {
        localStorage.setItem('isAuthenticatedUser', 'n');
        localStorage.setItem('userToken', 'x');
        localStorage.setItem('userid', 'x');
        this.userStore.set_user_is_authenticated(false);
        this.$q.notify({
            color: 'purple',
            textColor: 'white',
            position:'top',
            timeout: 1000,
            message: this.$t('message.you_have_been_logout')
        });
        this.userStore.set_user({
            appid: '',
            userid: '',
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNr: '',
            isAdmin: 'n',
            functie: '',
            userToken: '',
            companyName: '',
            companyCode: '',
            cif: '',
            lang: 'ro'
        });
        this.$router.push({name: 'Login'});
    }

}
