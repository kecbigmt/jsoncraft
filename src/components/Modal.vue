<template>
    <!-- Modal -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="filedManagerLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="filedManagerLabel">Manage fields</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Choose data type:</label>
                        <select class="form-control" v-model="dataType">
                            <option v-for="dataType in availableDataTypes" :value="dataType" :key="dataType">{{ dataType }}</option>
                        </select>
                    </div>
                    <div v-if="dataType" class="form-group">
                        <label>Choose fields to use:</label>
                        <div v-for="(value, key) in definitionOfSelectedDataType" :key="key" class="form-check">
                            <input class="form-check-input" type="checkbox"
                                :id="key"
                                :value="key"
                                :checked="typeof value != 'object' || value.required" 
                                :disabled="typeof value != 'object' || value.required"
                                v-model="selectedFields"
                                />
                            <label class="form-check-label" for="defaultCheck1">
                                {{ key }}
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button v-if="isArrayItem" type="button" class="btn btn-danger" data-dismiss="modal" @click="removeArrayItem">Delete</button>
                    <button v-if="isArray && !isArrayItem" type="button" class="btn btn-primary" @click="addStruct">Add</button>
                    <button v-else type="button" class="btn btn-primary" data-dismiss="modal" @click="updateStruct">Update</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import jp from 'jsonpath';

import store from '../store';
import Definition from '../config/definition.json';

export default {
    name: "Modal",
    data() {
        return {
            dataType: "",
            selectedFields: [],
        };
    },
    computed: {
        jsonPath: () => store.state.modalProps.jsonPath,
        //definition: () => store.state.modalProps.definition,
        definition: () => store.getters.modalFieldDefinition,
        isArray: ()  => store.getters.modalFieldDefinition && store.getters.modalFieldDefinition.array,
        isArrayItem: () => {
            const jsonPath = store.state.modalProps.jsonPath;
            return jsonPath ? !isNaN(jsonPath[jsonPath.length - 1]) : false;
        },
        availableDataTypes () {
            const dataType = store.getters.modalFieldDefinition && store.getters.modalFieldDefinition.dataType;
            if (dataType) {
                if (typeof dataType === 'string') {
                    return [dataType];
                } else if (Array.isArray(dataType)) {
                    return dataType;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        definitionOfSelectedDataType () {
            return Definition.structs[this.dataType];
        }
    },
    watch: {
        jsonPath () {
            const current = store.getters.modalCurrentValue;
            if (current && current.type) {
                this.dataType = current.type;
                this.selectedFields = Object.keys(current);
            } else {
                const def = this.definition.dataType;
                this.dataType = Array.isArray(def) ? def[0] : def;
            }
        },
        dataType (val) {
            const current = store.getters.modalCurrentValue;
            if (current && current.type) {
                return;
            } else {
                // initialize this.selectedFields by required fields of selected dataType.
            const definition = Definition.structs && Definition.structs[val];
                if (definition) {
                    this.selectedFields = Object.keys(definition).filter(key => typeof definition[key] !== 'object' || definition[key].required);
                }
            }
            
        }
    },
    methods: {
        updateStruct() {
            store.commit('updateJson', {
                jsonPath: store.state.modalProps.jsonPath,
                newValue: this.initializeValue(),
            });
        },
        addStruct () {
            store.commit('insertIntoJson', {
                jsonPath: store.state.modalProps.jsonPath,
                newValue: this.initializeValue(),
                insertPosition: store.state.modalProps.insertPosition,
            });
            store.commit('incrementInsertPosition');
        },
        removeArrayItem () {
            store.commit('removeJsonArrayItem', store.state.modalProps.jsonPath);
        },
        initializeValue () {
            return this.selectedFields.reduce((accum, fieldName) => {
                const fieldDefinition = this.definitionOfSelectedDataType[fieldName];
                if (typeof fieldDefinition === 'object') {
                    if (Array.isArray(fieldDefinition.dataType) && fieldDefinition.dataType.length > 1) {
                        Object.assign(accum, { [fieldName]: null });
                    } else {
                        if (fieldDefinition.defaultValue) {
                            Object.assign(accum, { [fieldName]: fieldDefinition.defaultValue });
                        } else {
                            let dataType;
                            if (Array.isArray(fieldDefinition.dataType)) {
                                dataType = fieldDefinition.dataType[0];
                            } else {
                                dataType = fieldDefinition.dataType;
                            }
                            switch (dataType) {
                                case 'string':
                                    Object.assign(accum, { [fieldName]: "" });
                                    break;
                                case 'number':
                                    Object.assign(accum, { [fieldName]: 0 });
                                    break;
                                case 'boolean':
                                    Object.assign(accum, { [fieldName]: false });
                                    break;
                                default:
                                    Object.assign(accum, { [fieldName]: null });
                            }
                        }
                    }
                } else {
                    Object.assign(accum, { [fieldName]: fieldDefinition });
                }
                return accum;
            }, {});
        },
    }
}
</script>