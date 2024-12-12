import React from 'react';
import { Modal, Input, Button } from 'antd';

const LegendModal = ({ visible, onClose, onSave, legendResult }) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title="Добавить легенду"
      centered
      bodyStyle={{ backgroundColor: '#e2e2e2', padding: 5, borderRadius: 4 }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, marginBottom: 4 }}>результат легенды</div>
        {legendResult}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, marginBottom: 4 }}>добавить описание</div>
        <Input.TextArea rows={4} placeholder="Введите описание..." />
      </div>
      <Button type="primary" onClick={onSave} style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
        сохранить
      </Button>
    </Modal>
  );
};

export default LegendModal;
