import {Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import draggable from "vuedraggable";
import {ServiceAdminNomCategory} from '@/services/ServiceAdminNomCategory';
import user from '@/store/user';
import nomenclatoare from '@/store/nomenclatoare';
import eventbus from '@/store/eventbus';
import {getModule} from "vuex-module-decorators";
import {TUser} from "@/types/TUser";
import {TCategory} from "@/types/TCategory";
import {TValueLabel} from "@/types/TValueLabel";
import {TDimensionsOrder} from "@/types/TDimensionsOrder";
import {EnumUM} from "@/types/EnumUM";
import {TUm1Um2} from "@/types/TUm1Um2";

@Options({
    name: "AdminCategory",
    components: {draggable}
})
export default class AdminCategory extends Vue {
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
    public ImgCategoryString64='';
    public filesSelectedForUpload:any= [];
    public label_editing_category='';
    public editingCategory:TCategory&TDimensionsOrder&TUm1Um2&{img:any|null,parent_name:string|null,hasChilds:string}={
        appid:'',
        pid:'',
        name_ro:'',
        name_en:'',
        name_bg:'',
        parent_pid:'',
        parent_name:'',
        category_level:'',
        children:null,
        img:null,
        withLength: '',
        withWidth: '',
        withThickness: '',
        withDiameter: '',
        withHeight: '',
        withAlloy: '',
        withType: '',
        withRollWeight: '',
        is_parent_for_articles: '',
        hasChilds:'n',
        positionLength: 0,
        positionWidth: 0,
        positionThickness: 0,
        positionDiameter: 0,
        positionHeight: 0,
        positionAlloy: 0,
        positionType: 0,
        positionRollWeight: 0,
        um1:'',
        um2:''
    }
    public treeDataCategories:TCategory[]=[];

    public listDimensionsNotUsed:TValueLabel[]= []
    public listDimensionsUsed:TValueLabel[]= []

    private getAllDimensionsTranslated(): TValueLabel[] {
        return [
            { label: this.$t('message.length') as string, value: 'l' },
            { label: this.$t('message.width') as string, value: 'w' },
            { label: this.$t('message.thickness') as string, value: 't' },
            { label: this.$t('message.diameter') as string, value: 'd' },
            { label: this.$t('message.height') as string, value: 'h' },
            { label: this.$t('message.aliaj') as string, value: 'a' },
            { label: this.$t('message.type') as string, value: 'k' },
            { label: this.$t('message.roll_weight') as string, value: 'g' }
        ]
    }

    get user(): TUser {
        return this.userStore.user;
    }

    get optionsUM(): EnumUM[] {
        return this.storeNomenclatoare.optionsUM;
    }

    resetFilter(): void {
        this.filter='';
    }

    openFormAddNewCategory(parent_pid: string, parent_name:string): void {
        const vueInst=this;
        vueInst.onResetFormCategory();
        vueInst.isOpenDialogCategory=true && vueInst.isAdminCategoryActivated;
        vueInst.editingCategory.parent_pid=parent_pid;
        vueInst.editingCategory.parent_name=parent_name;
        if(parent_pid && parent_pid.toString().length>0){
            vueInst.label_editing_category=vueInst.$t('message.subcategory_name') as string;
        }else{
            vueInst.label_editing_category=vueInst.$t('message.category_name') as string;
        }
    }

    openForModifyCategory(pid:string): void {
        const vueInst=this;
        const orderedDimensions:TValueLabel[]=[];
        vueInst.isOpenDialogCategory=true;
        vueInst.onResetFormCategory();
        vueInst.listDimensionsNotUsed= []
        vueInst.listDimensionsUsed=[];
        ServiceAdminNomCategory.getCategory(pid).then(response=>{
            if(response.status=='success'){
                vueInst.editingCategory.pid=pid;
                vueInst.editingCategory.name_ro=response.category.name_ro;
                vueInst.editingCategory.name_en=response.category.name_en;
                vueInst.editingCategory.name_bg=response.category.name_bg;
                vueInst.editingCategory.parent_pid=response.category.parent_pid;
                vueInst.editingCategory.parent_name=response.category.parent_name;
                vueInst.editingCategory.withLength=response.category.withLength;
                vueInst.editingCategory.withWidth=response.category.withWidth;
                vueInst.editingCategory.withThickness=response.category.withThickness;
                vueInst.editingCategory.withDiameter=response.category.withDiameter;
                vueInst.editingCategory.withHeight=response.category.withHeight;
                vueInst.editingCategory.withAlloy=response.category.withAlloy;
                vueInst.editingCategory.withType=response.category.withType;
                vueInst.editingCategory.withRollWeight = response.category.withRollWeight;
                vueInst.editingCategory.um1=response.category.um1;
                vueInst.editingCategory.um2=response.category.um2;
                vueInst.editingCategory.positionLength=response.category.positionLength*1;
                vueInst.editingCategory.positionWidth=response.category.positionWidth*1;
                vueInst.editingCategory.positionThickness=response.category.positionThickness*1;
                vueInst.editingCategory.positionDiameter=response.category.positionDiameter*1;
                vueInst.editingCategory.positionHeight=response.category.positionHeight*1;
                vueInst.editingCategory.positionAlloy=response.category.positionAlloy*1;
                vueInst.editingCategory.positionType=response.category.positionType*1;
                vueInst.editingCategory.positionRollWeight=response.category.positionRollWeight*1;
                vueInst.editingCategory.is_parent_for_articles=response.category.is_parent_for_articles;
                vueInst.editingCategory.hasChilds=response.category.hasChilds;
                if(vueInst.editingCategory.parent_pid && vueInst.editingCategory.parent_pid.toString().length>0){
                    vueInst.label_editing_category=vueInst.$t('message.subcategory_name') as string;
                }else{
                    vueInst.label_editing_category=vueInst.$t('message.category_name') as string;
                }
                if(response.category.withLength=='y' && response.category.positionLength*1>0){orderedDimensions.push({ label: vueInst.$t('message.length') as string, value: 'l' })}else{vueInst.listDimensionsNotUsed.push({ label: vueInst.$t('message.length') as string, value: 'l' })}
                if(response.category.withWidth=='y' && response.category.positionWidth*1>0){orderedDimensions.push({ label: vueInst.$t('message.width') as string, value: 'w' })}else{vueInst.listDimensionsNotUsed.push({ label: vueInst.$t('message.width') as string, value: 'w' })}
                if(response.category.withThickness=='y' && response.category.positionThickness*1>0){orderedDimensions.push({ label: vueInst.$t('message.thickness') as string, value: 't' })}else{vueInst.listDimensionsNotUsed.push({ label: vueInst.$t('message.thickness') as string, value: 't' })}
                if(response.category.withDiameter=='y' && response.category.positionDiameter*1>0){orderedDimensions.push({ label: vueInst.$t('message.diameter') as string, value: 'd' })}else{vueInst.listDimensionsNotUsed.push({ label: vueInst.$t('message.diameter') as string, value: 'd' })}
                if(response.category.withHeight=='y' && response.category.positionHeight*1>0){orderedDimensions.push({ label: vueInst.$t('message.height') as string, value: 'h' })}else{vueInst.listDimensionsNotUsed.push({ label: vueInst.$t('message.height') as string, value: 'h' })}
                if(response.category.withAlloy=='y' && response.category.positionAlloy*1>0){orderedDimensions.push({ label: vueInst.$t('message.aliaj') as string, value: 'a' })}else{vueInst.listDimensionsNotUsed.push({ label: vueInst.$t('message.aliaj') as string, value: 'a' })}
                if(response.category.withType=='y' && response.category.positionType*1>0){orderedDimensions.push({ label: vueInst.$t('message.type') as string, value: 'k' })}else{vueInst.listDimensionsNotUsed.push({ label: vueInst.$t('message.type') as string, value: 'k' })}
                if(response.category.withRollWeight=='y' && response.category.positionRollWeight*1>0){orderedDimensions.push({ label: vueInst.$t('message.roll_weight') as string, value: 'g' })}else{vueInst.listDimensionsNotUsed.push({ label: vueInst.$t('message.roll_weight') as string, value: 'g' })}

                if(response.category.withLength=='y' && response.category.positionLength*1>0){orderedDimensions[response.category.positionLength-1]={ label: vueInst.$t('message.length') as string, value: 'l' };}
                if(response.category.withWidth=='y' && response.category.positionWidth*1>0){orderedDimensions[response.category.positionWidth-1]={ label: vueInst.$t('message.width') as string, value: 'w' };}
                if(response.category.withThickness=='y' && response.category.positionThickness*1>0){orderedDimensions[response.category.positionThickness-1]={ label: vueInst.$t('message.thickness') as string, value: 't' };}
                if(response.category.withDiameter=='y' && response.category.positionDiameter*1>0){orderedDimensions[response.category.positionDiameter-1]={ label: vueInst.$t('message.diameter') as string, value: 'd' };}
                if(response.category.withHeight=='y' && response.category.positionHeight*1>0){orderedDimensions[response.category.positionHeight-1]={ label: vueInst.$t('message.height') as string, value: 'h' };}
                if(response.category.withAlloy=='y' && response.category.positionAlloy*1>0){orderedDimensions[response.category.positionAlloy-1]={ label: vueInst.$t('message.aliaj') as string, value: 'a' };}
                if(response.category.withType=='y' && response.category.positionType*1>0){orderedDimensions[response.category.positionType-1]={ label: vueInst.$t('message.type') as string, value: 'k' };}
                if(response.category.withRollWeight=='y' && response.category.positionRollWeight*1>0){orderedDimensions[response.category.positionRollWeight-1]={ label: vueInst.$t('message.roll_weight') as string, value: 'g' };}
                vueInst.listDimensionsUsed=orderedDimensions;

                ServiceAdminNomCategory.getImageCategoryAsString(pid).then((response:any)=>{
                    //console.log('getImageCategoryAsString with response=%o',response)
                    vueInst.ImgCategoryString64=response;
                })
            }
        })
    }
    deleteCategory(pid:string,name:string): void {
        const vueInst=this;
        vueInst.$q.dialog({
            title: vueInst.$t('message.confirm'),
            message: `${vueInst.$t('message.delete_category')} ${name}?`,
            cancel: true,
            persistent: true
        }).onOk(() => {
            ServiceAdminNomCategory.deleteCategory(pid).then(response=>{
                if(response.status=='success'){
                    vueInst.$q.notify({
                        color: 'teal',
                        textColor: 'white',
                        position:'top',
                        timeout: 500,
                        message: response.message
                    });
                    vueInst.loadTreeDataCategoriesFromDB();
                }
            })
        })
    }

    imgForCategoryWasAdded(file: File[]): void {
        const vueInst=this;
        vueInst.editingCategory.img = file[0];
    }

    public onSubmitFormCategory(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        // console.log('vueInst.filesSelectedForUpload=%o',vueInst.filesSelectedForUpload)
        // console.log('onListDimensionsChanged vueInst.listDimensionsUsed=%o',vueInst.listDimensionsUsed)
        vueInst.editingCategory.withLength='n';
        vueInst.editingCategory.withWidth='n';
        vueInst.editingCategory.withThickness='n';
        vueInst.editingCategory.withDiameter='n';
        vueInst.editingCategory.withHeight='n';
        vueInst.editingCategory.withAlloy='n';
        vueInst.editingCategory.withType='n';
        vueInst.editingCategory.withRollWeight='n';
        vueInst.editingCategory.positionLength=0;
        vueInst.editingCategory.positionWidth=0;
        vueInst.editingCategory.positionThickness=0;
        vueInst.editingCategory.positionDiameter=0;
        vueInst.editingCategory.positionHeight=0;
        vueInst.editingCategory.positionAlloy=0;
        vueInst.editingCategory.positionType=0;
        vueInst.editingCategory.positionRollWeight=0;
        // console.log('vueInst.editingCategory=%o',vueInst.editingCategory)
        vueInst.listDimensionsUsed.forEach((dimension,index)=>{
            if(dimension.value==='l'){vueInst.editingCategory.withLength='y';vueInst.editingCategory.positionLength=index*1+1;}
            if(dimension.value==='w'){vueInst.editingCategory.withWidth='y';vueInst.editingCategory.positionWidth=index*1+1;}
            if(dimension.value==='t'){vueInst.editingCategory.withThickness='y';vueInst.editingCategory.positionThickness=index*1+1;}
            if(dimension.value==='d'){vueInst.editingCategory.withDiameter='y';vueInst.editingCategory.positionDiameter=index*1+1;}
            if(dimension.value==='h'){vueInst.editingCategory.withHeight='y';vueInst.editingCategory.positionHeight=index*1+1;}
            if(dimension.value==='a'){vueInst.editingCategory.withAlloy='y';vueInst.editingCategory.positionAlloy=index*1+1;}
            if(dimension.value==='k'){vueInst.editingCategory.withType='y';vueInst.editingCategory.positionType=index*1+1;}
            if(dimension.value==='g'){vueInst.editingCategory.withRollWeight='y';vueInst.editingCategory.positionRollWeight=index*1+1;}
        });

        console.log('final vueInst.editingCategory=%o',vueInst.editingCategory);

        ServiceAdminNomCategory.postCategory(vueInst.editingCategory).then(response=>{
            console.log('postCategory response=%o',response);
            vueInst.$q.loading.hide();
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
            }
        });
    }

    public onResetFormCategory(): void {
        this.editingCategory={
            appid:'',
            pid:'',
            name_ro:'',
            name_en:'',
            name_bg:'',
            parent_pid:'',
            parent_name:'',
            category_level:'',
            children:null,
            img:null,
            withLength: '',
            withWidth: '',
            withThickness: '',
            withDiameter: '',
            withHeight: '',
            withAlloy: '',
            withType: '',
            withRollWeight: '',
            is_parent_for_articles: '',
            hasChilds:'n',
            positionLength: 0,
            positionWidth: 0,
            positionThickness: 0,
            positionDiameter: 0,
            positionHeight: 0,
            positionAlloy: 0,
            positionType: 0,
            positionRollWeight: 0,
            um1:'',
            um2:''
        }
        this.ImgCategoryString64='';
        this.listDimensionsNotUsed = this.getAllDimensionsTranslated();
        this.listDimensionsUsed = [];
        if(this.$refs.inputImgForCategory){this.$refs.inputImgForCategory.reset();}
    }

    public myFilterMethod (node:TCategory, filter:string): boolean | string{
        const filt = filter.toLowerCase()
        console.log('filter=%o',filt)
        return node.name_ro && node.name_ro.toLowerCase().indexOf(filt) > -1 || node.name_en && node.name_en.toLowerCase().indexOf(filt) > -1 || node.name_bg && node.name_bg.toLowerCase().indexOf(filt) > -1;
    }

    public loadTreeDataCategoriesFromDB(): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        ServiceAdminNomCategory.getNomCategoryTreeData().then(result=>{
            if(result.status=='success'){
                vueInst.treeDataCategories=result.treeDataCategories;
                vueInst.$refs.refTreeGrid.expandAll();
                vueInst.$q.loading.hide();
            }
        });
    }


//vueInst.EventBusStore.set_event({name:'eventClickAddBtn',params:null})
    @Watch('EventBusStore.event.eventId')
    onEventIdChanged(): void {
        const vueInst=this;
        if(vueInst.EventBusStore.event.name=='eventClickAddBtn'){
            if(vueInst.isAdminCategoryActivated){
                vueInst.openFormAddNewCategory('','');
            }
        }
    }

    public activated(): void {
        const vueInst=this;
        vueInst.isAdminCategoryActivated=true;
        vueInst.listDimensionsNotUsed = vueInst.getAllDimensionsTranslated();
        vueInst.listDimensionsUsed=[];
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(this.$t('message.admin_categories') as string);
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

