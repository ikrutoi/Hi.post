import listLabels from '../../../../../data/envelope/my-address-labels.json'
import Label from '../Label/Label'
import './FormMyAddress.scss'

const FormMyAddress = ({ valueMyAddress, handleValueMyAddress }) => {
  return (
    <form className="envelope-form form-my-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">My address</legend>
        {listLabels.map((name, i) => (
          <Label
            name={name}
            valueMyAddress={valueMyAddress}
            handleValueMyAddress={handleValueMyAddress}
            key={i}
          />
        ))}
      </fieldset>
    </form>
  )
}

export default FormMyAddress
