<template>
    <div class="footer">
            <div id="jsi-flying-fish-container">
            </div>
    </div>
</template>
<script>
import {RENDERER} from '../assets/js/fish.js'
export default {
    mounted() {
        try{
            RENDERER.init()
        }
        catch(e){
            console.log(e)
        }
    }
}
</script>
<style scoped>
.footer{
    position: absoulte;
    width:100%;
    /* background-color: #3a4145 */
    /* background-color: */
    bottom: 0;
    left: 0;
    z-index: -1;
}
</style>