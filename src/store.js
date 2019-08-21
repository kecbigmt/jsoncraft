import Vue from 'vue';
import Vuex from 'vuex';
import jp from 'jsonpath';

import Definition from './config/definition.json';

Vue.use(Vuex);

const initModalProps = {
    jsonPath: null,
    definition: { dataType: null },
};

const store = new Vuex.Store({
    state: {
        json: null,
        modalProps: initModalProps,
    },
    mutations: {
        setJson (state, newJson) {
            state.json = { ...newJson };
        },
        clearJson (state) {
            state.json = null;
        },
        updateJson (state, { jsonPath, newValue }) {
            const stringPath = jp.stringify(jsonPath);
            if (newValue.type) {
                const oldValue = jp.query(state.json, stringPath)[0];
                if (oldValue) {
                    Object.keys(newValue).forEach(key => {
                        if (oldValue[key] && key !== 'type') {
                            newValue[key] = oldValue[key];
                        }
                    });
                }
            }
            const newJson = { ...state.json };
            jp.value(newJson, stringPath, newValue);
            state.json = newJson;
        },
        insertIntoJson (state, { jsonPath, newValue, insertPosition }) {
            const stringPath = jp.stringify(jsonPath);
            const target = jp.query(state.json, stringPath)[0];
            if (target) {
                if (Array.isArray(target)) {
                    const newArray = [...target];
                    newArray.splice(insertPosition, 0, newValue);

                    const newJson = { ...state.json };
                    jp.value(newJson, stringPath, newArray);

                    state.json = newJson;
                } else {
                    alert('error: insertIntoJson: target of insertion is not array');
                    return;
                }
            } else {
                alert('error: insertIntoJson: wrong JSON Path');
                return;
            }
        },
        removeJsonArrayItem (state, jsonPath) {
            const targetIndex = jsonPath[jsonPath.length - 1];
            const array = jp.parent(state.json, jp.stringify(jsonPath));
            if (Array.isArray(array) && !isNaN(targetIndex)) {
                const newJson = { ...state.json };
                const parentStringPath = jp.stringify(jsonPath.slice(0, jsonPath.length - 1));
                jp.value(newJson, parentStringPath, array.filter((v, index) => index != targetIndex));
                state.json = newJson;
            } else {
                alert('error: removeJsonArrayItem');
            }
        },
        setJsonPath (state, jsonPath) {
            state.modalProps.jsonPath = jsonPath;
        },
        setInsertPosition (state, insertPosition) {
            state.modalProps.insertPosition = insertPosition;
        },
        incrementInsertPosition (state) {
            state.modalProps.insertPosition = state.modalProps.insertPosition + 1;
        }
    },
    getters: {
        modalCurrentValue: state => {
            if (state.modalProps.jsonPath) {
                return jp.query(state.json, jp.stringify(state.modalProps.jsonPath))[0];
            } else {
                return null;
            }
        },
        modalFieldDefinition: state => {
            // extract field defenition from given jsonPath
            let jsonPath = state.modalProps && state.modalProps.jsonPath;
            if (jsonPath) {
                const lastElement = jsonPath[jsonPath.length - 1];
                if (!isNaN(lastElement)) {
                    jsonPath = jsonPath.slice(0, jsonPath.length - 1);
                }
                const parent = jp.parent(store.state.json, jp.stringify(jsonPath));
                const fieldName = jsonPath[jsonPath.length - 1];
                if (parent) {
                    const dataType = parent.type;
                    return Definition.structs[dataType][fieldName];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }
});

export default store;