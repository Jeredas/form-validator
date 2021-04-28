class Control {
    constructor(parentNode = null, tagName = 'div', className = '', content = '') {
        const el = document.createElement(tagName);
        el.className = className;
        el.textContent = content;
        parentNode && parentNode.appendChild(el);
        this.node = el;
    }
}

class Input extends Control {
    constructor(parentNode, name, onValidate) {
        super(parentNode)
        this.name = name;
        this.caption = new Control(this.node, 'div');
        this.field = new Control(this.node, 'input');
        this.error = new Control(this.node, 'div');
        this.field.node.addEventListener('input', () => {
            if (this.validate) {
                this.setError(this.validate(this.getValue()));
            }
            if(this.onInput){
                this.onInput();
            }
        });
        this.validate = onValidate ;
    }

    getValue() {
        return this.field.node.value;
    }

    setError(err) {
        
        if (err === null){
            this.error.node.textContent = 'ok';
            this.field.node.classList.remove('invalid');
        } else {
            this.error.node.textContent = err;
            this.field.node.classList.add('invalid')
        }

    }

}

class Form extends Control {
    constructor(parentNode, onValidate) {
        super(parentNode)
        this.validate = onValidate;
        this.inputs = [];
        this.isValid = false;
    }

    getObject() {
        let result = {};
        this.inputs.forEach((elem) => result[elem.name] = elem.field.node.value);
        return result;
    }

    addInput(name) {
        const newInput = new Input(this.node, name);
        newInput.onInput = () => {
            this.setErrors(this.validate(this.getObject()));
        }
        this.inputs.push(newInput);
    }

    setErrors(obj) {
        Object.keys(obj).forEach((key) => {
            let inp = this.inputs.find(input => input.name === key);
            if (inp) {
                inp.setError(obj[key]);
            }
        })
        let lastValid = this.isValid;
       this.isValid = Object.keys(obj).every((key) => {
            return !obj[key]    
        })
        if (!this.isValid){
            this.node.classList.remove('valid');
        } else {
            this.node.classList.add('valid')
        }
        if(lastValid !== this.isValid){
            this.onChangeValidState && this.onChangeValidState(this.isValid);
        }
    }
}
const validator =  (values) => {
    console.log(values)
    let param = ((
        (values['name1'].length > values['name2'].length) &&
        (values['name2'].length > values['name3'].length)
    ) ? null : 'error'
    )
    return {
        'name1': param,
        'name2': param,
        'name3': param,
        'name4': (Number.isNaN(+values['name4']) ? 'error' : null)
    };
};
const form = new Form(document.body, validator)

form.onChangeValidState = (ee)=> console.log(ee) 
form.addInput('name1');
form.addInput('name2')
form.addInput('name3')
form.addInput('name4')
