/*

  LOCAL VARIABLE

  This is a little input component.  

*/


class LocalVariable extends HTMLElement {

  getNewID() {
    return 'dtrm-xxxxxxxxxxxxxxxx-'
      .replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16)
    }) + Date.now()
  }

  getValuesFromURL(URL = window.location.href ){
    const search_params = new URLSearchParams(URL)
    let options = {
    }
    for (const [key, unparsed_value] of search_params) {
      if(key !== window.location.origin + window.location.pathname + '?' ){
        try {
          const value = JSON.parse(decodeURI(unparsed_value))
          options[key] = value
        } catch {
          options[key] = decodeURI(unparsed_value)
        }
      }
    }
    return options
  }


  connectedCallback(){
    this.id = this.getAttribute('id')
    if(this.id === null){
      this.id = getNewID()
    }    
    
    this.name = this.getAttribute('name')
    if(this.name === null){
      this.name = this.id
    }

    this.source = this.getAttribute('source')
    if(this.source === null){
      this.initializeInput()
    } else {
      this.initializeOutput()
    }
  }

  initializeOutput(){
    this.innerText = document.querySelector(`#${this.source}`).value
    document.querySelector(`#${this.source}`)
      .addEventListener('UPDATED', (e) => {
        this.innerText = e.detail[this.source]
    })
  }

  initializeInput(){


    const url_vars = this.getValuesFromURL()
    const local_var_value = localStorage.getItem(this.id)

    if(local_var_value !== null){
      this.value = local_var_value
    } else if(typeof(url_vars[this.id]) !== 'undefined'){
        this.value = url_vars.id
    } else {
      this.value = this.getAttribute('value')
      if(this.value === null){
        this.value = ''
      }
    }



    this.input = document.createElement('input')
    this.input.setAttribute('value', this.value)
    this.input.setAttribute('name', this.name)
    this.input.addEventListener('keydown', (e) => {
      if(e.key === "Enter" && !e.ctrlKey){
        this.setAttribute('value', e.target.value)
      }
    })
    
    this.input.addEventListener('blur', (e) => {
      this.setAttribute('value', e.target.value)
    })

    this.placeholder = this.getAttribute('placeholder')
    if(this.placeholder !== null){
      this.input.setAttribute('placeholder', this.placeholder)
    } else {
      this.input.setAttribute('placeholder', this.id)
    }
    this.appendChild(this.input)
    const create_event = new CustomEvent('CREATED', {id:this.id})
    this.dispatchEvent(create_event)
  }
  
  static get observedAttributes() {
    return ['value', 'id'];
  }

  update(new_value){
    this.value = new_value
    let detail = new Object()
    detail[this.id] = this.value
    localStorage.setItem(this.id, this.value)
    const new_event = new CustomEvent('UPDATED', {detail})
    this.dispatchEvent(new_event)
  }

  attributeChangedCallback(name, old_value, new_value){
    if(name === 'value' && old_value !== new_value){
      this.update(new_value)
    }

    if(name === 'id' && old_value !== new_value){
      const delete_event = new CustomEvent('DELETED', {id:this.id})
      this.dispatchEvent(delete_event)
    }
  }

  disconnectedCallback() {
    const delete_event = new CustomEvent('DELETED', {id:this.id})
    this.dispatchEvent(delete_event)
  }
}

/*
  this component can be placed in the document using the notation
  <custom-element title="element name here"></custom-element>
  to change the name of the element in the dom, change the 
  value in the quotation marks. 
*/

customElements.define('local-variable', LocalVariable)
