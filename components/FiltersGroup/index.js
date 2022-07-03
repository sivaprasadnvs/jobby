import './index.css'

const FiltersGroup = props => {
  const {eachEmpType, onFilterCheckbox} = props
  const {label, employmentTypeId, isChecked} = eachEmpType

  const onChangeEventHandler = () => {
    onFilterCheckbox(employmentTypeId)
  }

  const renderEmploymentType = () => (
    <li className="emp-list-item">
      <input
        type="checkbox"
        className="check-box"
        onChange={onChangeEventHandler}
        id={employmentTypeId}
        checked={isChecked}
      />
      <label className="label-name" htmlFor={employmentTypeId}>
        {label}
      </label>
    </li>
  )

  return <div> {renderEmploymentType()}</div>
}

export default FiltersGroup
