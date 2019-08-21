<template>
    <div class="struct p-2 mb-2">
        <div v-if="type" class="flexbox">
            <button v-if="structOpen" type="button" class="btn" @click="toggleStructOpen">
                <i class="fa fa-chevron-down"></i>
            </button>
            <button v-else type="button" class="btn" @click="toggleStructOpen">
                <i class="fa fa-chevron-right"></i>
            </button>
            <Input type="text" label="type" :jsonPath="jsonPath.concat('type')" :value="type" readonly/>
        </div>
        <div v-show="structOpen" v-for="(value, key) in innerData" :key="key">
            <Input v-if="typeof value === 'string'" type="text" :jsonPath="jsonPath.concat(key)" :label="key" :value="value"/>
            <Input v-else-if="typeof value === 'number'" type="number" :jsonPath="jsonPath.concat(key)" :label="key" :value="value"/>
            <Input v-else-if="typeof value === 'boolean'" type="checkbox" :jsonPath="jsonPath.concat(key)" :label="key" :checked="value"/>
            <div v-else-if="typeof value === 'object'" class="flexbox">
                <!-- 'object' is Array or Object or null -->
                <div>
                    <FieldButton
                        :label="key"
                        :jsonPath="jsonPath.concat(key)"
                        :definition="definition[key]"
                        />
                </div>
                <StructArray v-if="Array.isArray(value)" :jsonPath="jsonPath.concat(key)" :definition="definition[key]" :value="value"/>
                <Struct v-else-if="value != null" :jsonPath="jsonPath.concat(key)" :type="value.type" :value="value"/>
                <div v-else style="flex-grow: 1;">
                    <FieldButton
                        :label="value"
                        :jsonPath="jsonPath.concat(key)"
                        :definition="definition[key]"
                        />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Input from './Input.vue';
import Struct from './Struct.vue';
import FieldButton from './FieldButton.vue';
import Definition from '../config/definition.json';

export default {
    name: 'Struct',
    components: {
        Input,
        Struct,
        StructArray: () => import('./StructArray.vue'),
        FieldButton,
    },
    data() {
        return {
            structOpen: true,
        };
    },
    props: {
        value: Object,
        type: String,
        jsonPath: Array,
        root: Boolean,
    },
    computed: {
        isArray: function() {
            return Array.isArray(this.value);
        },
        innerData: function() {
            const innerData = { ...this.value };
            delete innerData.type;
            return innerData;
        },
        definition: function() {
            if (this.root) {
                return Definition.root;
            } else {
                return Definition.structs[this.type];
            }
            
        }
    },
    methods: {
        toggleStructOpen: function() {
            this.structOpen = !this.structOpen;
        }
    }
}
</script>