import Vue from 'vue'
import Header from './comps/header/header'
import Icon from './classify/Icon'
import Img from './classify/Img'
import Waterfall from './classify/Waterfall'
import List from './classify/List'

Vue.component('Header', Header)
Vue.component(Icon.name, Icon)
Vue.component(Img.name, Img)
Vue.component('vc-waterfall', Waterfall)
Vue.component('vc-list', List)
