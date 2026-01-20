export function eraseDefaultProps(svgComponent: React.FC): React.FC {
  const defaultProps = svgComponent.defaultProps;
  return (props) => {
    const newProps = { ...defaultProps, ...props };
    return svgComponent(newProps);
  };
}
