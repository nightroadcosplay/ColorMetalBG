import store from './index';
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';
import {TUser} from '@/types/TUser';
import {LocalStorage, Notify} from 'quasar';
import { TUserCompany } from '@/types/TUserCompany';

@Module({ namespaced: true, dynamic: true, store, name: 'storeUser'})
export default class User extends VuexModule {
    public userIsAuthenticated=false;
    public user: TUser = {
        appid: '',
        userid: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNr: '',
        isAdmin: 'n',
        functie: '',
        userToken: '',
        companyName:'',
        companyCode:'',
        cif:'',
        lang: 'ro'
    };
    public showMenuBar=false;
    public showBackBar=false;
    public titleBackBar='';
    public pageTransition = 'scale-slide';
    public PREVIOUS1_ROUTE_NAME='x';
    public PREVIOUS2_ROUTE_NAME='x';

    public ScreenWidth=1440;
    public ScreenHeight=900;
    public countAdrese=0;
    public countOferte=0;
    public userCompanies: Array<TUserCompany> = [];

    public MyImgProfileString64 = '';

    @Mutation
    public SET_PREVIOUS_ROUTE_NAME(routeName: string) {
        this.PREVIOUS2_ROUTE_NAME = this.PREVIOUS1_ROUTE_NAME;
        this.PREVIOUS1_ROUTE_NAME = routeName;
    }
    @Action
    public set_previous_route_name(routeName: string | symbol) {
        this.context.commit('SET_PREVIOUS_ROUTE_NAME', routeName);
    }

    @Mutation
    public SET_PAGE_TRANSITION(ptransition: string) {
        this.pageTransition = ptransition;
    }
    @Action
    public set_page_transition(ptransition: string) {
        this.context.commit('SET_PAGE_TRANSITION', ptransition);
    }

    @Mutation
    public SET_USER(puser: TUser) {
        this.user = puser;
    }
    @Action
    public set_user(puser: TUser) {
        this.context.commit('SET_USER', puser);
    }

    @Mutation
    public SET_SHOWMENUBAR(pstatus: boolean) {
        this.showMenuBar = pstatus;
        if(pstatus){this.showBackBar=false;}
    }
    @Action
    public set_showmenubar(pstatus: boolean) {
        this.context.commit('SET_SHOWMENUBAR', pstatus);
    }

    @Mutation
    public SET_SHOWBACKBAR(pstatus: boolean) {
        this.showBackBar = pstatus;
        if(pstatus){this.showMenuBar=false;}
    }
    @Action
    public set_showbackbar(pstatus: boolean) {
        this.context.commit('SET_SHOWBACKBAR', pstatus);
    }

    @Mutation
    public SET_TITLE_BACK_BAR(ptitle: string) {
        this.titleBackBar = ptitle;
    }
    @Action
    public set_title_back_bar(ptitle: string) {
        this.context.commit('SET_TITLE_BACK_BAR', ptitle);
    }

    @Mutation
    public SET_USER_IS_AUTHENTICATED(pstatus: boolean) {
        this.userIsAuthenticated = pstatus;
    }
    @Action
    public set_user_is_authenticated(pstatus: boolean) {
        this.context.commit('SET_USER_IS_AUTHENTICATED', pstatus);
    }

    @Mutation
    public SET_SCREENWIDTH(pnumber: number) {
        this.ScreenWidth = pnumber;
    }
    @Action
    public set_screenwidth(pnumber: number) {
        this.context.commit('SET_SCREENWIDTH', pnumber);
    }

    @Mutation
    public SET_SCREENHEIGHT(pnumber: number) {
        this.ScreenHeight = pnumber;
    }
    @Action
    public set_screenheight(pnumber: number) {
        this.context.commit('SET_SCREENHEIGHT', pnumber);
    }

    @Mutation
    public SET_CSRF_TOKEN(ptoken: string) {
        this.user.userToken = ptoken;
    }
    @Action
    public set_csrf_token(ptoken: string) {
        this.context.commit('SET_CSRF_TOKEN', ptoken);
    }

    @Mutation
    public SET_MYIMGPROFILESTRING64(pimgstring: string) {
        this.MyImgProfileString64 = pimgstring;
    }
    @Action
    public set_myimgprofilestring64(pimgstring: string) {
        this.context.commit('SET_MYIMGPROFILESTRING64', pimgstring);
    }

    @Mutation
    public SET_COUNT_ADRESE(pnumber: number) {
        this.countAdrese = pnumber;
    }
    @Action
    public set_screencountadrese(pnumber: number) {
        this.context.commit('SET_COUNT_ADRESE', pnumber);
    }

    @Mutation
    public SET_COUNT_OFERTE(pnumber: number) {
        this.countOferte = pnumber;
    }
    @Action
    public set_screencountoferte(pnumber: number) {
        this.context.commit('SET_COUNT_OFERTE', pnumber);
    }
    
    @Mutation
    public SET_USER_COMPANIES(userCompanies: Array<TUserCompany>) {
        this.userCompanies = userCompanies;
    }
    @Action
    public set_user_companies(userCompanies: Array<TUserCompany>) {
        this.context.commit('SET_USER_COMPANIES', userCompanies);
    }
}
