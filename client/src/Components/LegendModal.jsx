import React from 'react';
import { Modal, Input, Button, Spin } from 'antd';

const LegendModal = ({ isLoading, visible, onClose, onSave, legendResult, author, legend, onAuthorChange, onLegendChange }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Добавить легенду"
      centered
      styles={{ backgroundColor: '#e2e2e2', padding: 5, borderRadius: 4 }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, marginBottom: 4 }}>Формула</div>
        {legendResult}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, marginBottom: 4 }}>Добавить легенду</div>
        <Input.TextArea rows={3} placeholder="Введите легенду..." value={legend} onChange={onLegendChange} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, marginBottom: 4 }}>Добавить имя автора</div>
        <Input.TextArea rows={2} placeholder="Введите имя автора..." value={author} onChange={onAuthorChange} />
      </div>
      <Button disabled={isLoading} type="primary" onClick={onSave} style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
        {isLoading ? <Spin /> : 'сохранить'}
      </Button>
    </Modal>
  );
};

export default LegendModal;
