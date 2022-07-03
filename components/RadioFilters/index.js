const RadioFilters = props => {
  const {eachSalaryRange, onFilterRadio} = props
  const {label, salaryRangeId, isCheckedRadio} = eachSalaryRange

  const onValueChange = () => {
    onFilterRadio(salaryRangeId)
  }

  return (
    <div>
      <li className="emp-list-item">
        <input
          type="radio"
          className="check-box"
          id={salaryRangeId}
          value={salaryRangeId}
          checked={isCheckedRadio}
          onChange={onValueChange}
        />
        <label htmlFor={salaryRangeId} className="label-name">
          {label}
        </label>
      </li>
    </div>
  )
}

export default RadioFilters
