import {Prop} from 'vue-property-decorator';
import { Vue, Options } from 'vue-class-component'
import {CONFIG_ENV} from '@/config';
type TCategory ={ pid:string, name_ro:string, name_en:string, name_bg:string, isParentForArticles:string};

@Options({
    name: "CategoryImg",
    components: {}
})
export default class CategoryImg extends Vue {
    @Prop({ default: { pid:'', name_ro:'', name_en:'', name_bg:'', isParentForArticles:'n'} }) public category!: TCategory;
    public urlToJPG = CONFIG_ENV.URL_CATEGORY.getJPG;
}
