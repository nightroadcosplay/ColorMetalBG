import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'

type infoCateg={
    "categoryPid":string,
    "categoryName":string
}


@Options({
    name: "HierarchicalChainBrowseHeader",
    components: {}
})
export default class HierarchicalChainBrowseHeader extends Vue {
    @Prop({ default:() => [] }) public readonly hierarchicalChain!: infoCateg[];
    public inputFastSearch = '';
    declare public $refs: any;

    get showBrowseCategoriesIcon():boolean {
        if(this.$route.fullPath=='/browse_categories/0'){
            return false;
        }else return true;
    }

    get showInputFastSearch():boolean {
        /*
        if(this.$route.name=='BrowseArticles' || this.$route.name=='Dashboard'  ||(this.hierarchicalChain && this.hierarchicalChain.length > 0 )) {
            return false;
        }else return true;
         */
        return false;
    }

    public onGoToBrowseCategories(categoryPid:string): void {
        this.$router.push({name: 'BrowseCategories',  params: { pid: categoryPid }});
    }

}
