Vue.component('cart',
    {
        template:`
        <div class="modal">
            <button v-on:click="onClick">close</button>
            <div class="cart-list">
                <card v-for="item of list" :good="item" v-on:cardaction="onRemove" :actionname="'Удалить'"></card>
            </div>
        </div>
        `,
        props: ['list'],
        methods: {
            onClick(){
                this.$emit('cart-close')
            },
            onRemove(id){
                this.$emit('removefromcart', id)
            }
        }
    }
)