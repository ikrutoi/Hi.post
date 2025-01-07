import labelsList from '../../../../../data/toAddressLabels.json'
import Label from '../Label/Label'
import './FormToAddress.scss'

const FormToAddress = ({ valueToAddress, handleValueToAddress }) => {
  return (
    <form className="envelope-form form-to-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">To address</legend>
        {labelsList.map((name, i) => (
          <Label
            name={name}
            valueToAddress={valueToAddress}
            handleValueToAddress={handleValueToAddress}
            key={i}
          />
        ))}
      </fieldset>
    </form>
  )
}

export default FormToAddress
