// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import LirButton, { type LirButtonProps } from './LirButton.vue';

describe('LirButton', () => {
  it('rendert Slot-Inhalt und type="button" als Default', () => {
    const wrapper = mount(LirButton, { slots: { default: 'Version publizieren' } });
    expect(wrapper.text()).toContain('Version publizieren');
    expect(wrapper.attributes('type')).toBe('button');
  });

  it('emittiert click bei aktivem Zustand', async () => {
    const wrapper = mount(LirButton, { slots: { default: 'OK' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('emittiert kein click bei disabled oder loading', async () => {
    const cases: LirButtonProps[] = [{ disabled: true }, { loading: true }];
    for (const props of cases) {
      const wrapper = mount(LirButton, { props, slots: { default: 'OK' } });
      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    }
  });

  it('kennzeichnet loading mit aria-busy', () => {
    const wrapper = mount(LirButton, { props: { loading: true }, slots: { default: 'OK' } });
    expect(wrapper.attributes('aria-busy')).toBe('true');
  });
});
