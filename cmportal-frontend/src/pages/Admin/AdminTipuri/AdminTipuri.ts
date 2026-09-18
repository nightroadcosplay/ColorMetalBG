import { Vue, Options } from 'vue-class-component'
import draggable from "vuedraggable";
import {ServiceAdminNomCategory} from '@/services/ServiceAdminNomCategory';
import user from '@/store/user';
import nomenclatoare from '@/store/nomenclatoare';
import eventbus from '@/store/eventbus';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {EnumUM} from "@/types/EnumUM";
import { TTip } from '@/types/TTip';
import { TCategoryTip } from '@/types/TCategoryTip';

@Options({
    name: "AdminTipuri",
    components: {draggable}
})
export default class AdminTipuri extends Vue {
    public inputSearchArticle='';
    public isAdminCategoryActivated=false;
    declare public $refs: any;
    public userStore = getModule(user);
    public storeNomenclatoare = getModule(nomenclatoare);
    public EventBusStore = getModule(eventbus);
    public filter = '';
    public isOpenDialogCategory=false;
    public dialogTransitionShow='';
    public dialogTransitionHide='';
    public ImgCategoryString641='';
    public ImgCategoryString642='';
    public ImgCategoryString643='';
    public filesSelectedForUpload:any= [];
    get label_editing_category(): string {
        return this.$t('message.name_tip') as string;
    }
    public editingCategory:TTip&{img1:any|null,img2:any|null,img3:any|null}={
        appid: 0,
        size_type_ro: '',
        size_type_en: '',
        size_type_bg: '',
        type_id: '',
        pid_category: 0,
        img1: null,
        img2: null,
        img3: null
    } 
    public treeDataCategories:TCategoryTip[]=[];

    get user(): TUser {
        return this.userStore.user;
    }

    get optionsUM(): EnumUM[] {
        return this.storeNomenclatoare.optionsUM;
    }

    resetFilter(): void {
        this.filter='';
    }

    openForModifyCategory(appid:number): void {
        const vueInst=this;
        vueInst.isOpenDialogCategory=true;
        vueInst.onResetFormCategory();
        ServiceAdminNomCategory.getTip(appid).then(response=>{
            if(response.status=='success'){
                vueInst.editingCategory.appid=appid;
                vueInst.editingCategory.size_type_ro=response.tip.size_type_ro;
                vueInst.editingCategory.size_type_en=response.tip.size_type_en;
                vueInst.editingCategory.size_type_bg=response.tip.size_type_bg;
                vueInst.editingCategory.pid_category=response.tip.pid_category;
                vueInst.editingCategory.type_id=response.tip.type_id;
                ServiceAdminNomCategory.getImagesCategoryAsStringTip(vueInst.editingCategory.type_id).then((response:any)=>{
                    //console.log('getImageCategoryAsString with response=%o',response)
                    vueInst.ImgCategoryString641=response.image1;
                    vueInst.ImgCategoryString642=response.image2;
                    vueInst.ImgCategoryString643=response.image3;
                })
            }
        })
    }

    imgForCategoryWasAdded1(file: File[] | FileList): void {
        const vueInst=this;
        vueInst.editingCategory.img1 = file[0];
    }

    imgForCategoryWasAdded2(file: File[] | FileList): void {
        const vueInst=this;
        vueInst.editingCategory.img2 = file[0];
    }

    imgForCategoryWasAdded3(file: File[] | FileList): void {
        const vueInst=this;
        vueInst.editingCategory.img3 = file[0];
    }

    public onSubmitFormCategory(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        console.log('vueInst.filesSelectedForUpload=%o',vueInst.filesSelectedForUpload)
        console.log('vueInst.editingCategory=%o',vueInst.editingCategory)
       
        ServiceAdminNomCategory.postTip(vueInst.editingCategory).then(response=>{
            if(response.status=='success'){
                vueInst.$q.notify({
                    color: 'teal',
                    textColor: 'white',
                    position:'top',
                    timeout: 500,
                    message: response.message
                });
                vueInst.isOpenDialogCategory=false;
                vueInst.onResetFormCategory();
                vueInst.loadTreeDataCategoriesFromDB();
                vueInst.$q.loading.hide();
            } else {
                vueInst.$q.loading.hide();
                vueInst.$q.notify({
                    color: 'red',
                    textColor: 'white',
                    position:'top',
                    message: response.message
                });
            }
        });
    }

    public onResetFormCategory(): void {
        this.editingCategory={...this.editingCategory,
            img1: null,
            img2: null,
            img3: null
        }
        this.ImgCategoryString641='';
        this.ImgCategoryString642='';
        this.ImgCategoryString643='';
        if(this.$refs.inputImgForCategory1){this.$refs.inputImgForCategory1.reset();}
        if(this.$refs.inputImgForCategory2){this.$refs.inputImgForCategory2.reset();}
        if(this.$refs.inputImgForCategory3){this.$refs.inputImgForCategory3.reset();}
    }

    public deleteImage(no_img: number): void {
        const vueInst=this;
        switch(no_img) {
            case 1:
                this.editingCategory.img1 = null;
                this.ImgCategoryString641='';
                if(this.$refs.inputImgForCategory1){this.$refs.inputImgForCategory1.reset();}
                break;
            case 2:
                this.editingCategory.img2 = null;
                this.ImgCategoryString642='';
                if(this.$refs.inputImgForCategory2){this.$refs.inputImgForCategory2.reset();}
                break;
            case 3:
                this.editingCategory.img3 = null;
                this.ImgCategoryString643='';
                if(this.$refs.inputImgForCategory3){this.$refs.inputImgForCategory3.reset();}
                break;
        }
        const filePath = '/uploads_img_product/'+ this.editingCategory.type_id +'_' + (no_img) + '.jpg';
        ServiceAdminNomCategory.deleteFile(filePath).then(response => {
            if(response.status == 'success') {
                vueInst.$q.notify({
                    color: 'teal',
                    textColor: 'white',
                    position:'top',
                    timeout: 500,
                    message: response.message
                });
            }
        });
    }

    public myFilterMethod (node:TCategoryTip, filter:string): boolean | string {
        const filt = filter.toLowerCase()
        console.log('filter=%o',filt)
        return (node.name_ro && node.name_ro.toLowerCase().indexOf(filt) > -1) || (node.name_en && node.name_en.toLowerCase().indexOf(filt) > -1) || (node.name_bg && node.name_bg.toLowerCase().indexOf(filt) > -1);
    }

    public loadTreeDataCategoriesFromDB(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        ServiceAdminNomCategory.getTipuri().then(result=>{
            if(result.status=='success'){
                vueInst.treeDataCategories=result.treeDataCategories;
                vueInst.$refs.refTreeGrid.expandAll();
                vueInst.$q.loading.hide();
            }
        });
    }

    sincronizareTipuri(): void {
        const vueInst = this;
        ServiceAdminNomCategory.sincronizareTipuri().then(result =>{
            if(result.status == 'success') {
                vueInst.loadTreeDataCategoriesFromDB();
            }
        });
    }


    public activated(): void {
        const vueInst=this;
        vueInst.isAdminCategoryActivated=true;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.administration_types') as string);
        }
        if(this.$q.platform.is.mobile){
            this.dialogTransitionShow ='slide-left';
            this.dialogTransitionHide ='slide-right';
        }else{
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }
        vueInst.loadTreeDataCategoriesFromDB();
    }

    public deactivated(): void {
        this.isAdminCategoryActivated = false;
    }
}

