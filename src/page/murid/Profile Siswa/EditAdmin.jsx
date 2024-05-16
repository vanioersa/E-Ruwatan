import React from 'react'
import Sidebar from '../../../component/Sidebar'
import { Link } from 'react-router-dom'

function EditAdmin() {
    return (
        <div>
            <Sidebar/>
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab"
                                data-tabs-toggle="#default-tab-content" role="tablist">
                                <li class="me-2" role="presentation">
                                    <Link to={"/Profile_admin"}>
                                        <button class="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab"
                                            data-tabs-target="#profile" type="button" role="tab" aria-controls="profile"
                                            aria-selected="false">
                                            Profile
                                        </button>
                                    </Link>
                                </li>
                                <li class="me-2" role="presentation">
                                    <Link to={"/editprofileadmin"}>
                                        <button
                                            class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                                            id="settings-tab" data-tabs-target="#settings" type="button" role="tab"
                                            aria-controls="settings" aria-selected="false">
                                            Edit Profile
                                        </button>
                                    </Link>
                                </li>
                                <li class="me-2" role="presentation">
                                    <Link to={"/setting"}>
                                        <button
                                            class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                                            id="settings-tab" data-tabs-target="#settings" type="button" role="tab"
                                            aria-controls="settings" aria-selected="false">
                                            Settings
                                        </button>
                                    </Link>
                                </li>
                            </ul>
        </div>
    )
}

export default EditAdmin
