import listLabels from '../../../../../data/myAddressLabels.json'
import Label from '../Label/Label'
import './FormMyAddress.scss'

const FormMyAddress = ({ valueMyAddress, handleValueMyAddress }) => {
  return (
    <form className="envelope-form form-my-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">My address</legend>
        {listLabels.map((name, i) => (
          <Label
            handleValueMyAddress={handleValueMyAddress}
            valueMyAddress={valueMyAddress}
            name={name}
            key={i}
          />
        ))}
      </fieldset>
    </form>
  )
}

export default FormMyAddress
