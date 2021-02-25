"use strict";

var lowestCommonAncestor = function lowestCommonAncestor(root, p, q) {
  if (root == null || root == p || root == q) {
    return root;
  }

  var left = lowestCommonAncestor(root.left, p, q);
  var right = lowestCommonAncestor(root.right, p, q);

  if (left == null) {
    return right;
  } else if (right == null) {
    return left;
  } else {
    return root;
  }
};