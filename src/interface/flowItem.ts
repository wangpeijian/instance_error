import ProcessStatus from '@/enum/ProcessStatus';

interface FlowItem {
    status: ProcessStatus;
    request: any;
}

export default FlowItem;