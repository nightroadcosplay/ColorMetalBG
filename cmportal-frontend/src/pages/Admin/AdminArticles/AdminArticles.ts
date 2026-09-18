import {Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {ServiceAdminNomProducts} from '@/services/ServiceAdminNomProducts';
import user from '@/store/user';
import eventbus from '@/store/eventbus';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TArticle} from "@/types/TArticle";
import EditArticle from "@/components/Admin/EditArticle/EditArticle.vue";
import { parsePostgresArray } from '@/modules/utils';
import {localizedTypeLabel} from '@/modules/typeLabel';

@Options({
    name: "AdminArticles",
    components: {EditArticle}
})
export default class AdminArticles extends Vue {
    public inputSearchArticle='';
    private currentPageNumber=1;
    private maxPagesNumber=1;
    private totalItems=0;
    public filterText = '';
    declare public $refs: any;
    public dialogTransitionShow ='';
    public dialogTransitionHide ='';
    public userStore = getModule(user);
    public EventBusStore = getModule(eventbus);
    public isShoDialogEditArticle=false;
    public selectedPidArticle='';
    public arrArticles: TArticle[]=[];
    public nomenclatoareStore = getModule(nomenclatoare);

    // Type label in the current language; the RO text stays the stored value.
    public typeLabel(sizeType: string|null|undefined): string {
        return localizedTypeLabel(sizeType, this.$i18n.locale);
    }

    get user(): TUser {
        return this.userStore.user;
    }


    onOpenFormAddNewArticle(): void {
        this.selectedPidArticle='0';
        // console.log('isAdminArticlesActivated=%o',this.isAdminArticlesActivated)
        if(this.$q.platform.is.mobile){
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }else{
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }
        this.isShoDialogEditArticle=true  && this.isAdminArticlesActivated;
    }

    inputPaginator(params:number): void {
        this.getPageWithArticlesFromDB(params);
    }

    closeFormEditArticle(needRefresh:boolean): void {
        const vueInst=this;
        vueInst.isShoDialogEditArticle=false;
        if(needRefresh){
            vueInst.getPageWithArticlesFromDB(vueInst.currentPageNumber);
        }
    }

    openProductForEditing(particle:TArticle): void {
        const vueInst=this;
        //alert('2optiune dezactivata, nu cred ca trebuie sa se poata edita din Portal')
        vueInst.isShoDialogEditArticle=true;
        vueInst.selectedPidArticle=particle.pid;
    }

    changeStatus2(newValue:string, evt:Event): void {
        console.log('changeStatus with newValue=%o for evt=%o',newValue,evt)
    }

    changeStatus(particle: TArticle): void {
        const vueInst=this;
        let newStatus='x';
        if(typeof(particle.isActive) === 'string'){
            if(particle.isActive=='y'){newStatus='y';}
            if(particle.isActive=='n'){newStatus='n';}
        }
        if(typeof(particle.isActive) === 'boolean'){
            if(particle.isActive){newStatus='y';}else{newStatus='n';}
        }

        ServiceAdminNomProducts.changeStatusActivInactiv(particle.pid,newStatus).then(response=>{
            vueInst.$q.notify({
                color: 'teal',
                textColor: 'white',
                icon: 'positive',
                position: 'top',
                timeout: 2000,
                message: response.message
            })
        })
    }

    public getPageWithArticlesFromDB(pageNumber:number): void {
        const vueInst=this;
        ServiceAdminNomProducts.getNomProductsData(pageNumber,vueInst.filterText).then(response=>{
            if(response.status=='success'){
                vueInst.arrArticles=[];
                vueInst.currentPageNumber=pageNumber;
                vueInst.maxPagesNumber=response.totalPages;
                response.products.forEach(product=>{
                    const categoryPids = parsePostgresArray(product.categoryPid);
                    // console.log('found categoryPids=%o',categoryPids);
                    const lantHierarchyCategory=vueInst.nomenclatoareStore.optionsCategories.filter(category=>{
                        // console.log(categoryPids.includes(category.pid));
                        return categoryPids.includes(category.pid.toString());
                    });
                    // console.log('found lantHierarchyCategory=%o',lantHierarchyCategory);
                    vueInst.arrArticles.push({
                        appid:product.appid,
                        pid:product.pid,
                        categoryPid:product.categoryPid,
                        categories: (lantHierarchyCategory!== undefined?lantHierarchyCategory: []),
                        code: product.code,
                        name_ro:product.name_ro,
                        name_en:product.name_en,
                        name_bg:product.name_bg,
                        UMBase:product.UMBase,
                        um1: product.um1,
                        um2: product.um2,
                        um1ToUm2: product.um1ToUm2,
                        isActive:product.isActive,
                        withLength: product.withLength,
                        withWidth: product.withWidth,
                        withThickness: product.withThickness,
                        withDiameter: product.withDiameter,
                        withHeight:product.withHeight,
                        withAlloy:product.withAlloy,
                        withType:product.withType,
                        sizeLength:product.sizeLength,
                        sizeWidth:product.sizeWidth,
                        sizeThickness:product.sizeThickness,
                        sizeDiameter:product.sizeDiameter,
                        sizeHeight:product.sizeHeight,
                        sizeAlloy:product.sizeAlloy,
                        sizeType:product.sizeType
                    });
                });
            }
        });
    }

    public get isAdminArticlesActivated():boolean{
        return this.$route.name=='AdminArticles';
    }

    @Watch('EventBusStore.event.eventId')
    onEventIdChanged(): void {
        const vueInst=this;
        if(vueInst.EventBusStore.event.name=='eventClickAddBtn'){
            if(vueInst.isAdminArticlesActivated){
                vueInst.onOpenFormAddNewArticle();
            }
        }
    }

    @Watch('currentPageNumber')
    onCurrentPageNumberChanged(): void {
        const vueInst=this;
        vueInst.getPageWithArticlesFromDB(vueInst.currentPageNumber);
    }

    @Watch('filterText')
    onFilterTextChanged(): void {
        const vueInst=this;
        vueInst.getPageWithArticlesFromDB(vueInst.currentPageNumber);
    }

    public created(): void {
        console.log(this.$route.name)
        this.getPageWithArticlesFromDB(1);
    }

    public activated(): void {
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.manage_items') as string);
        }
        this.getPageWithArticlesFromDB(1);
    }

}

