import labelsList from '../../../../../data/myAddressLabels.json'
import Label from '../Label/Label'
import './FormMyAddress.scss'

const FormMyAddress = () => {
  return (
    <form className="envelope-form form-my-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">My address</legend>
        {labelsList.map((name, i) => (
          <Label name={name} key={i} />
        ))}
      </fieldset>
    </form>
  )
}

export default FormMyAddress
