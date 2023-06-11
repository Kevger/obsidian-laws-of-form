import { type ReactTestRenderer, create as render } from 'react-test-renderer';
import { ObsidianLoFBlockErrorMessage } from '../ObsidianLoFBlockErrorMessage';

describe('ObsidianLofBlockErrorMessage', () => {
  describe('given we have an error message', () => {
    const errorMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    let component: ReactTestRenderer;
    beforeEach(() => {
      component = render(<ObsidianLoFBlockErrorMessage msg={errorMessage} />);
    });

    it('renders correctly', () => {
      const snapshot = component.toJSON();
      expect(snapshot).toMatchSnapshot();
    });

    it('contains the error message', () => {
      expect(component.root.findByType('div').children[0]).toBe(errorMessage);
    });
  });
});
