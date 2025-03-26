export const stringValidation = (e) => {
  const startPosition = e.target.selectionStart;
  const endPosition = e.target.selectionEnd;
  const inputValue = e.target.value.toUpperCase();

  // Check if the typed character is not an uppercase letter or space
  if (/[^A-Z\s]/.test(inputValue.charAt(startPosition - 1))) {
    // If so, reset the input value and cursor position
    e.target.value = inputValue.replace(/[^A-Z\s]/g, "");
    e.target.setSelectionRange(startPosition - 1, startPosition - 1);
  } else {
    // Otherwise, proceed with uppercase conversion and character filtering
    const filteredValue = inputValue.toUpperCase().replace(/[^A-Z\s]/g, "");

    // Update the input value and cursor position
    e.target.value = filteredValue;
    e.target.setSelectionRange(startPosition, endPosition);
  }
};

export const stringAndNoValidation = (e) => {
  const startPosition = e.target.selectionStart;
  const endPosition = e.target.selectionEnd;
  const inputValue = e.target.value.toUpperCase();

  if (/[^A-Z0-9\s]/.test(inputValue.charAt(startPosition - 1))) {
    e.target.value = inputValue.replace(/[^A-Z0-9\s]/g, "");
    e.target.setSelectionRange(startPosition - 1, startPosition - 1);
  } else {
    const filteredValue = inputValue.toUpperCase().replace(/[^A-Z0-9\s]/g, "");

    e.target.value = filteredValue;
    e.target.setSelectionRange(startPosition, endPosition);
  }
};

export const stringAndNoAndSpecialCharValidation = (e) => {
  const startPosition = e.target.selectionStart;
  const endPosition = e.target.selectionEnd;
  const inputValue = e.target.value.toUpperCase();

  if (/[^A-Z0-9\s&\-]/.test(inputValue.charAt(startPosition - 1))) {
    e.target.value = inputValue.replace(/[^A-Z0-9\s&\-]/g, "");
    e.target.setSelectionRange(startPosition - 1, startPosition - 1);
  } else {
    const filteredValue = inputValue.replace(/[^A-Z0-9\s&\-]/g, "");

    e.target.value = filteredValue;
    e.target.setSelectionRange(startPosition, endPosition);
  }
};

export const codeFieldValidation = (e) => {
  const startPosition = e.target.selectionStart;
  const endPosition = e.target.selectionEnd;
  const inputValue = e.target.value.toUpperCase();

  if (/[^a-zA-Z0-9-\/\\]/.test(inputValue.charAt(startPosition - 1))) {
    e.target.value = inputValue.replace(/[^a-zA-Z0-9-\/\\]/g, "");
    e.target.setSelectionRange(startPosition - 1, startPosition - 1);
  } else {
    const filteredValue = inputValue.replace(/[^a-zA-Z0-9-\/\\]/g, "");

    e.target.value = filteredValue;
    e.target.setSelectionRange(startPosition, endPosition);
  }
};
