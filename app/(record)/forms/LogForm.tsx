import { CustomInput, FormBase } from "../FormBase"

export default function LogForm({
  title,
  description,
  formClass,
}: {
  title: string
  description?: string
  formClass?: string
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Log config
  }
  return (
    <FormBase
      title={title}
      description={description}
      formClass={formClass}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <CustomInput
          label="firstname"
          placeholder="Tyler"
          labelName="First Name"
        />
        <CustomInput
          label="lasttname"
          placeholder="Durdon"
          labelName="Last Name"
        />
      </div>
      <CustomInput
        label="email"
        placeholder="projectmayhem@fc.com"
        labelName="Email Address"
        containerClass="mb-4"
      />
      <CustomInput
        label="password"
        placeholder="••••••••"
        labelName="Password"
        containerClass="mb-4"
      />
      <CustomInput
        label="twitterpassword"
        placeholder="••••••••"
        labelName="Your twitter password"
        containerClass="mb-8"
        type="twitterpassword"
      />
    </FormBase>
  )
}
