import {Prop, Watch} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {ServiceBrowseCategories} from '@/services/ServiceBrowseCategories';
import user from '@/store/user';
import {getModule} from "vuex-module-decorators";
import CategoryImg from "@/components/CategoryImg/CategoryImg.vue";
import HierarchicalChainBrowseHeader from '@/components/HierarchicalChainBrowseHeader/HierarchicalChainBrowseHeader.vue'
import eventbus from "@/store/eventbus";

type TCategory ={ pid:string, name_ro:string, name_en:string, name_bg:string, isParentForArticles:string};
type infoCateg={
    "categoryPid":string,
    "categoryName":string
}
@Options({
    name: "BrowseCategories",
    components: {CategoryImg,HierarchicalChainBrowseHeader}
})
export default class BrowseCategories extends Vue {
    @Prop({ default: '0' }) public readonly pid!: string;
    @Prop({ default: 'fromDashboard' }) public readonly typeOfAccess!: string;
    public selectedCategory: TCategory = { pid:'', name_ro:'', name_en:'', name_bg:'', isParentForArticles:'' };
    public hierarchicalChain:infoCateg[] = [];
    public dialogTransitionShow='';
    public dialogTransitionHide='';
    public isMainCategory=false;
    public inputSearchArticle='';
    declare public $refs: any;
    public userStore = getModule(user);
    public categories: { pid:string, name_ro:string, name_en:string, name_bg:string, isParentForArticles:string, children:  { pid:string, name_ro:string, name_en:string, name_bg:string, isParentForArticles:string, children:  { pid:string, name_ro:string, name_en:string, name_bg:string}[] }[] }[]=[];
    public EventBusStore = getModule(eventbus);

    public browseCategory(pCategory: TCategory): void {
        const vueInst=this;
        this.selectedCategory=pCategory;
        //extend(true, this.selectedCategory,  pCategory);
        if(vueInst.typeOfAccess=='fromDashboard') {
            if (pCategory.isParentForArticles == 'y') {
                this.$router.push({name: 'BrowseArticles', params: {pidCategory: pCategory.pid}})
            } else {
                vueInst.isMainCategory=true;
                this.$router.push({
                    name: 'BrowseCategories',
                    params: {pid: pCategory.pid, typeOfAccess: 'fromDashboard'}
                })
            }
        }

        if(vueInst.typeOfAccess=='fromCerere') {
            if (pCategory.isParentForArticles == 'y') {
                vueInst.EventBusStore.set_event({name:'eventBrowseArticles',params:{pidCategory: pCategory.pid}});
            }
            else{
                vueInst.isMainCategory=true;
                vueInst.EventBusStore.set_event({name:'eventBrowseCategories',params:{pid: pCategory.pid}});
            }
        }

        if(vueInst.typeOfAccess=='fromOferta') {
            if (pCategory.isParentForArticles == 'y') {
                vueInst.EventBusStore.set_event({name:'eventBrowseArticles',params:{pidCategory: pCategory.pid}});
            }
            else{
                vueInst.isMainCategory=true;
                vueInst.EventBusStore.set_event({name:'eventBrowseCategories',params:{pid: pCategory.pid}});
            }
        }
    }

    public getCategory(): void {
        const vueInst=this;
        ServiceBrowseCategories.getDetailsCategoryFromDB(vueInst.pid).then(response => {
            vueInst.$q.loading.hide();
            if(response.status=='success'){
                vueInst.selectedCategory.pid=response.categoryPid;
                vueInst.selectedCategory.name_ro=response.categoryNameRO;
                vueInst.selectedCategory.name_en=response.categoryNameEN;
                vueInst.selectedCategory.name_bg=response.categoryNameBG;
                vueInst.selectedCategory.isParentForArticles=response.isParentForArticles;
                vueInst.categories = response.categories;
                vueInst.hierarchicalChain = response.hierarchicalChain;
            }
        })
    }

    public getCategories(): void {
        const vueInst=this;
        vueInst.isMainCategory=false;
        ServiceBrowseCategories.getDetailsCategoriesFromDB().then(response => {
            vueInst.$q.loading.hide();
            if(response.status=='success'){
                //extend(true, vueInst.categories,  response.categories);
                vueInst.categories = response.categories;
            }
        })
    }

    @Watch('pid')
    onPidChanged(newPid: string): void {
        const vueInst=this;
        vueInst.$q.loading.show();
        vueInst.hierarchicalChain=[];
        if(newPid=='0'){
            vueInst.getCategories();
        }else{
            vueInst.getCategory();
        }
    }

    created(): void {
        this.getCategories();
    }

    public activated(): void {
        const vueInst=this;
        this.userStore.set_page_transition('fade-in-right');
        if(this.$q.platform.is.mobile) {
            this.userStore.set_showbackbar(true);
            this.userStore.set_title_back_bar(vueInst.$t('message.categories'));
        }
        if(this.$q.platform.is.mobile){
            this.dialogTransitionShow ='slide-left';
            this.dialogTransitionHide ='slide-right';
        }else{
            this.dialogTransitionShow ='slide-right';
            this.dialogTransitionHide ='slide-left';
        }
    }
}
