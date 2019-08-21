<template>
     <div class="input-group my-2">
        <div class="input-group-prepend">
            <div class="input-group-text">{{ label }}</div>
        </div>
        <input :type="type" class="form-control" :id="label" :placeholder="placeholder" :value="value" :readonly="readonly" :checked="checked" @input="updateJson">
    </div>
</template>
<script>
import store from '../store';

export default {
    props: {
        label: String,
        type: String,
        placeholder: String,
        value: [String, Number],
        checked: Boolean,
        readonly: Boolean,
        jsonPath: Array
    },
    methods: {
        updateJson(e) {
            let newValue;
            if (this.type === 'number') {
                newValue = parseInt(e.target.value);
            } else if (this.type === 'checkbox') {
                newValue = !this.checked;
            } else {
                newValue = e.target.value;
            }
            store.commit('updateJson', { jsonPath: this.jsonPath, newValue: newValue } );
        }
    }
}
</script>