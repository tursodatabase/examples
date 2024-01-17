import 'package:flutter/material.dart';

formValidation(dynamic val, String validationText) {
  if (val == null || val.isEmpty) {
    return validationText;
  }
  return null;
}

/// SizedBox with height of [size]
Widget verticalDivider({double size = 30}) => const SizedBox(
      height: 30,
    );
