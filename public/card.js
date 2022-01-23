Vue.component('card',
    {template:`
        <div class="card">
            <h3>{{ good.title }}</h3>
            <p>{{ good.price }}$</p>
            <button v-on:click="onClick">{{ actionname }}</button>
        </div>
        `,
        props: ['good', 'actionname'],
        methods: {
            onClick(){
                this.$emit('cardaction', this.good.id)
            }
        }
    }
)

