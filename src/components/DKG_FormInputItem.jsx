import React from 'react'
import {Form, Input, InputNumber} from "antd"

const FormInputItem = ({label, name, value, onChange, readOnly, disabled, className, placeholder, required, min, max, type}) => {
  const handleChange = (e) => {

    if(onChange)
      if(typeof name === 'string')
        onChange(name, e.target.value)
      else
        onChange(name[2], e.target.value)
  }
  return (
    <Form.Item label={label} name={name}
      // rules = {rules}
      rules={[{ required: required ? true : false, message: 'Please input a value!' }]}
      // className={`!mb-4 flex flex-col sm:flex-row items-center ${className}`}
      className={className}
    >
      {
        type === 'number' ? 
        <InputNumber
        step={1}          // Increment/decrement step
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        style={{ width: '100%' }} // Adjust width as needed
      />
      :
        <Input value={value} onChange={handleChange} readOnly={readOnly} disabled={disabled} placeholder={placeholder}/>
      }
    </Form.Item>
  )
}

export default FormInputItem