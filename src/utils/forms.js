export function inputValidate(data, errors) {
  if (data?.firstName?.trim().length === 0) {
    errors.firstName = "This field is required.";
  }
  if (data?.lastName?.trim().length === 0) {
    errors.lastName = "This field is required.";
  }
  if (data?.address?.trim().length === 0) {
    errors.address = "This field is required.";
  }
  if (data?.city?.trim().length === 0) {
    errors.city = "This field is required.";
  }
  if (data?.email?.trim().length === 0) {
    errors.email = "This field is required.";
  }
  if (data?.dateOfBirth?.trim().length === 0) {
    errors.dateOfBirth = "This field is required.";
  }
  if (data?.email && !data?.email?.includes("@")) {
    errors.email = "you need to type Your Email";
  }
  if (data?.confPassword?.trim().length === 0) {
    errors.confPassword = "This field is required.";
  }
  if (data.confPassword&&
    data?.confPassword?.trim().length !== 0 &&
    data?.confPassword !== data?.password
  ) {
    errors.confPassword = "Password Dose'nt Match";
  }
  if (data?.password?.trim().length === 0) {
    errors.password = "This field is required.";
  }
}
